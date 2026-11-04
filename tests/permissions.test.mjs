import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { plants } from "../src/data/plants.ts";
import { journalEntries } from "../src/data/journalEntries.ts";

test("Supabase schema protects content and photos", async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon;
      create role authenticated;
      create schema auth;
      create table auth.users (id uuid primary key);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth, public to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
      create schema storage;
      create table storage.buckets (id text primary key, name text, public boolean,
        file_size_limit bigint, allowed_mime_types text[]);
      create table storage.objects (id text primary key, bucket_id text, name text);
      alter table storage.objects enable row level security;
      grant usage on schema storage to anon, authenticated;
      grant select, insert, update, delete on storage.objects to anon, authenticated;
    `);
    await db.exec(await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8"));
    await db.exec(`
      insert into auth.users values ('11111111-1111-4111-8111-111111111111'),
        ('22222222-2222-4222-8222-222222222222');
      insert into public.admin_users values ('11111111-1111-4111-8111-111111111111');
      set role anon;
    `);
    assert.deepEqual((await db.query("select * from public.plants")).rows, []);
    await assert.rejects(db.exec(`insert into public.plants (id, category, "commonName", "scientificName")
      values ('forbidden', 'bonsais', 'Forbidden', 'Forbidden')`));
    await assert.rejects(db.exec("insert into public.admin_users values ('22222222-2222-4222-8222-222222222222')"));
    await assert.rejects(db.exec("select public.import_initial_content('[]', '[]')"));
    await db.exec(`set role authenticated;
      set request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222'`);
    assert.equal((await db.query("select public.is_admin() as allowed")).rows[0].allowed, false);
    await assert.rejects(db.exec(`insert into public.plants (id, category, "commonName", "scientificName")
      values ('forbidden', 'bonsais', 'Forbidden', 'Forbidden')`));
    await assert.rejects(db.exec("select public.import_initial_content('[]', '[]')"));
    await assert.rejects(db.exec("insert into storage.objects values ('forbidden', 'plant-photos', 'test.jpg')"));
    await db.exec("set request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111'");
    assert.equal((await db.query("select public.is_admin() as allowed")).rows[0].allowed, true);
    const plant = { id: "test-tree", category: "bonsais", commonName: "Test", scientificName: "Test species" };
    const entry = { id: "test-entry", plantId: plant.id, date: "2026-11-04", title: "Test", description: "Notes" };
    await assert.rejects(db.query("select public.import_initial_content($1, $2)", [
      JSON.stringify([plant]), JSON.stringify([{ ...entry, plantId: "missing" }]),
    ]));
    assert.equal((await db.query("select count(*)::int as count from public.plants")).rows[0].count, 0);
    await db.query("select public.import_initial_content($1, $2)", [JSON.stringify([plant]), JSON.stringify([entry])]);
    await assert.rejects(db.query("select public.import_initial_content($1, $2)", [JSON.stringify([plant]), "[]"]));
    await db.exec(`update public.plants set "commonName" = 'Edited' where id = 'test-tree';
      insert into storage.objects values ('photo', 'plant-photos', 'test.jpg')`);
    await assert.rejects(db.exec("delete from public.plants where id = 'test-tree'"));
    await db.exec("set request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222'");
    await db.exec(`update public.plants set "commonName" = 'Forbidden';
      delete from public.journal_entries;
      delete from storage.objects;`);
    assert.equal((await db.query("select * from public.admin_users")).rows.length, 0);
    await db.exec("set role anon; set request.jwt.claim.sub = ''");
    assert.equal((await db.query('select "commonName" from public.plants')).rows[0].commonName, "Edited");
    assert.equal((await db.query("select * from public.journal_entries")).rows.length, 1);
    assert.equal((await db.query("select * from storage.objects")).rows.length, 1);
    await db.exec(`set role authenticated;
      set request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
      delete from public.journal_entries; delete from public.plants; delete from storage.objects;`);
    assert.equal((await db.query("select * from public.plants")).rows.length, 0);
    await db.query("select public.import_initial_content($1, $2)", [
      JSON.stringify(plants), JSON.stringify(journalEntries),
    ]);
    assert.equal((await db.query("select * from public.plants")).rows.length, plants.length);
    assert.equal((await db.query("select * from public.journal_entries")).rows.length, journalEntries.length);
  } finally {
    await db.close();
  }
});