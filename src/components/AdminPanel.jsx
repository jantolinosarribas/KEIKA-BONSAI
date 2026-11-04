import { useEffect, useState } from "react";
import { ArrowUpRight, Download, LogOut, Mail, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { categories, plants as initialPlants } from "../data/plants";
import { journalEntries as initialEntries } from "../data/journalEntries";
import { hasPartialConfiguration, supabase } from "../lib/supabase";

const inputClass = "mt-1 w-full min-w-0 rounded border border-green-900/30 bg-white/70 px-3 py-2 text-base text-green-950 focus:outline-2 focus:outline-green-700 disabled:opacity-60";
const buttonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded border border-green-900/30 px-3 py-2 text-sm text-green-950 hover:bg-white/50 focus-visible:outline-2 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-50";
const plantFields = [
  ["commonName", "Nombre com\u00fan", true],
  ["scientificName", "Nombre cient\u00edfico", true],
  ["age", "Edad"],
  ["cultivationTime", "Tiempo en cultivo"],
  ["origin", "Origen"],
  ["location", "Ubicaci\u00f3n"],
  ["substrate", "Sustrato"],
  ["futureDesign", "Dise\u00f1o futuro"],
];
const imageTypes = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };

function errorMessage(error) {
  if (error?.code === "23503") return "Este \u00e1rbol tiene entradas en el diario. No se ha eliminado.";
  if (error?.code === "42501") return "Tu sesi\u00f3n no tiene permiso para realizar esta operaci\u00f3n.";
  return "No se pudo completar la operaci\u00f3n. Comprueba la conexi\u00f3n y vuelve a intentarlo.";
}

async function readRecords() {
  const [plantResult, entryResult] = await Promise.all([
    supabase.from("plants").select("*").order("commonName"),
    supabase.from("journal_entries").select("*").order("date", { ascending: false }),
  ]);
  if (plantResult.error || entryResult.error) throw plantResult.error ?? entryResult.error;
  return { plants: plantResult.data, entries: entryResult.data };
}

function Field({ label, children }) {
  return <label className="block min-w-0 text-sm text-green-900">{label}{children}</label>;
}

export default function AdminPanel() {
  const [user, setUser] = useState(undefined);
  const [access, setAccess] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [failure, setFailure] = useState("");
  const [busy, setBusy] = useState(false);
  const [records, setRecords] = useState({ plants: [], entries: [] });
  const [tab, setTab] = useState("plants");
  const [draft, setDraft] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setFailure("No se pudo recuperar la sesi\u00f3n. Solicita un nuevo enlace de acceso.");
      setUser((current) => current === undefined ? data.session?.user ?? null : current);
    }).catch(() => {
      if (active) {
        setFailure("No se pudo recuperar la sesi\u00f3n.");
        setUser(null);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser((current) => current?.id === session?.user?.id ? current : session?.user ?? null);
    });
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (hash.has("error") || new URLSearchParams(window.location.search).has("error")) {
      setFailure("El enlace no es v\u00e1lido o ha caducado. Solicita uno nuevo.");
      window.history.replaceState(null, "", window.location.pathname);
    }
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!supabase || user === undefined) return;
    let active = true;
    setDraft(null);
    setDirty(false);
    setRecords({ plants: [], entries: [] });
    if (!user) { setAccess("signed-out"); return; }
    setAccess("loading");
    async function authorize() {
      try {
        const { data, error } = await supabase.rpc("is_admin");
        if (error) throw error;
        if (!data) {
          if (active) setAccess("denied");
          return;
        }
        const loaded = await readRecords();
        if (active) { setRecords(loaded); setAccess("ready"); }
      } catch {
        if (active) { setFailure("No se pudo comprobar el acceso o cargar el contenido."); setAccess("error"); }
      }
    }
    authorize();
    return () => { active = false; };
  }, [user, attempt]);

  useEffect(() => {
    if (!dirty) return;
    function warnBeforeLeaving(event) { event.preventDefault(); event.returnValue = ""; }
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [dirty]);

  function clearFeedback() { setFailure(""); setMessage(""); }
  function canDiscard() { return !dirty || window.confirm("Hay cambios sin guardar. \u00bfQuieres descartarlos?"); }
  function changeField(name, value) { setDraft((current) => ({ ...current, [name]: value })); setDirty(true); }

  async function sendLink(event) {
    event.preventDefault();
    clearFeedback(); setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) throw error;
      setMessage("Si el correo est\u00e1 autorizado, recibir\u00e1s un enlace de acceso.");
    } catch { setFailure("No se pudo enviar el enlace. Comprueba el correo o int\u00e9ntalo m\u00e1s tarde."); }
    finally { setBusy(false); }
  }

  async function signOut() {
    if (!canDiscard()) return;
    clearFeedback(); setBusy(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) throw error;
      setUser(null);
    } catch (error) { setFailure(errorMessage(error)); }
    finally { setBusy(false); }
  }

  function chooseTab(next) {
    if (next === tab || !canDiscard()) return;
    setTab(next); setDraft(null); setDirty(false); clearFeedback();
  }

  function editRecord(record) {
    if (!canDiscard()) return;
    clearFeedback(); setDraft({ ...record }); setIsNew(false); setDirty(false);
  }

  function newRecord() {
    if (!canDiscard()) return;
    clearFeedback(); setIsNew(true); setDirty(false);
    setDraft(tab === "plants" ? {
      id: `arbol-${crypto.randomUUID()}`, category: "prebonsais", commonName: "", scientificName: "", description: "",
    } : {
      id: `entrada-${crypto.randomUUID()}`, plantId: records.plants[0]?.id ?? "",
      date: new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()),
      title: "", description: "", observation: "", nextStep: "", photos: [], isMock: false,
    });
  }

  async function saveRecord(event) {
    event.preventDefault(); clearFeedback(); setBusy(true);
    try {
      const payload = tab === "plants"
        ? Object.fromEntries(["id", "category", ...plantFields.map(([name]) => name), "description", "image"]
          .map((name) => [name, draft[name]?.trim() || null]))
        : {
            id: draft.id, plantId: draft.plantId, date: draft.date, title: draft.title.trim(),
            description: draft.description.trim(), observation: draft.observation?.trim() || null,
            nextStep: draft.nextStep?.trim() || null, photos: draft.photos ?? [], isMock: Boolean(draft.isMock),
          };
      const table = tab === "plants" ? "plants" : "journal_entries";
      const query = isNew ? supabase.from(table).insert(payload) : supabase.from(table).update(payload).eq("id", draft.id);
      const { error } = await query.select("id").single();
      if (error) throw error;
      setDirty(false); setIsNew(false);
      setRecords(await readRecords());
      setDraft(null); setMessage("Cambios guardados.");
    } catch (error) { setFailure(errorMessage(error)); }
    finally { setBusy(false); }
  }

  async function deleteRecord() {
    if (!window.confirm(tab === "plants" ? "\u00bfEliminar este \u00e1rbol? Esta acci\u00f3n no se puede deshacer." : "\u00bfEliminar esta entrada? Esta acci\u00f3n no se puede deshacer.")) return;
    clearFeedback(); setBusy(true);
    try {
      const { error } = await supabase.from(tab === "plants" ? "plants" : "journal_entries")
        .delete().eq("id", draft.id).select("id").single();
      if (error) throw error;
      setDirty(false); setDraft(null);
      setRecords(await readRecords()); setMessage("Contenido eliminado.");
    } catch (error) { setFailure(errorMessage(error)); }
    finally { setBusy(false); }
  }

  async function importContent() {
    if (!window.confirm("\u00bfImportar las plantas y la entrada de ejemplo del proyecto?")) return;
    clearFeedback(); setBusy(true);
    try {
      const { error } = await supabase.rpc("import_initial_content", { plant_data: initialPlants, entry_data: initialEntries });
      if (error) throw error;
      setRecords(await readRecords()); setMessage("Contenido inicial importado.");
    } catch (error) { setFailure(errorMessage(error)); }
    finally { setBusy(false); }
  }

  async function uploadPhotos(event) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    clearFeedback();
    if (files.some((file) => !imageTypes[file.type] || file.size > 10485760)) {
      setFailure("Admite JPG, PNG, WebP o AVIF de hasta 10 MB por foto."); return;
    }
    if (tab === "journal" && (draft.photos?.length ?? 0) + files.length > 20) {
      setFailure("Cada entrada admite hasta 20 fotos."); return;
    }
    setBusy(true);
    const uploaded = [];
    try {
      const photos = [];
      for (const file of files) {
        const path = `${user.id}/${crypto.randomUUID()}.${imageTypes[file.type]}`;
        const { error } = await supabase.storage.from("plant-photos").upload(path, file, { contentType: file.type, upsert: false });
        if (error) throw error;
        uploaded.push(path);
        const { data } = supabase.storage.from("plant-photos").getPublicUrl(path);
        photos.push({ src: data.publicUrl, alt: tab === "plants" ? draft.commonName || "\u00c1rbol" : draft.title || "Foto del proceso" });
      }
      if (tab === "plants") changeField("image", photos[0].src);
      else changeField("photos", [...(draft.photos ?? []), ...photos]);
    } catch (error) {
      if (uploaded.length) await supabase.storage.from("plant-photos").remove(uploaded);
      setFailure(errorMessage(error));
    } finally { setBusy(false); }
  }

  const feedback = <>
    {failure && <p role="alert" className="my-4 break-words border-l-2 border-red-700 pl-3 text-red-800">{failure}</p>}
    {message && <p role="status" className="my-4 break-words text-green-800">{message}</p>}
  </>;

  if (!supabase || hasPartialConfiguration) return <p role="status" className="mt-6 text-green-900">Administraci&oacute;n pendiente de configurar.</p>;
  if (user === undefined || access === "loading") return <div className="mt-6">{feedback}<p role="status" className="text-green-900">Comprobando acceso...</p></div>;
  if (!user) return <div className="mt-8 max-w-sm">
    <h2 className="text-xl text-green-950">Acceso del propietario</h2>
    {feedback}
    <form onSubmit={sendLink} className="mt-5 space-y-4">
      <Field label="Correo electr&oacute;nico"><input type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} disabled={busy} className={inputClass} /></Field>
      <button type="submit" disabled={busy} className={buttonClass}><Mail size={18} aria-hidden="true" />{busy ? "Enviando..." : "Enviar enlace de acceso"}</button>
    </form>
  </div>;
  if (access === "denied" || access === "error") return <div className="mt-6 space-y-4">
    {feedback}
    {access === "denied" && <p role="alert" className="text-green-950">Esta cuenta no tiene permisos de administraci&oacute;n.</p>}
    {access === "error" && <button type="button" className={buttonClass} onClick={() => { clearFeedback(); setAttempt((current) => current + 1); }}>Reintentar</button>}
    <button type="button" disabled={busy} onClick={signOut} className={buttonClass}><LogOut size={18} aria-hidden="true" />Cerrar sesi&oacute;n</button>
  </div>;

  const items = tab === "plants" ? records.plants : records.entries;
  const photos = tab === "plants" ? (draft?.image ? [{ src: draft.image, alt: draft.commonName }] : []) : draft?.photos ?? [];

  return <div className="mt-6 text-green-950">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-green-900/20 pb-5">
      <p className="min-w-0 break-all text-sm text-green-800">{user.email}</p>
      <button type="button" onClick={signOut} disabled={busy} className={buttonClass}><LogOut size={18} aria-hidden="true" />Cerrar sesi&oacute;n</button>
    </div>
    {feedback}
    <div className="my-5 flex flex-wrap items-center justify-between gap-4">
      <div role="group" aria-label="Tipo de contenido" className="flex gap-1 border-b border-green-900/20">
        {[["plants", "Plantas"], ["journal", "Diario"]].map(([value, label]) => <button key={value} type="button" disabled={busy} aria-pressed={tab === value} onClick={() => chooseTab(value)} className={`min-h-11 border-b-2 px-4 py-2 focus-visible:outline-2 focus-visible:outline-green-700 ${tab === value ? "border-green-800 font-medium" : "border-transparent text-green-800/70"}`}>{label}</button>)}
      </div>
      <div className="flex flex-wrap gap-2">
        {!records.plants.length && !records.entries.length && <button type="button" disabled={busy} onClick={importContent} className={buttonClass}><Download size={18} aria-hidden="true" />Importar datos actuales</button>}
        <button type="button" disabled={busy || (tab === "journal" && !records.plants.length)} onClick={newRecord} className={buttonClass}><Plus size={18} aria-hidden="true" />{tab === "plants" ? "Nueva planta" : "Nueva entrada"}</button>
      </div>
    </div>
    <div className="grid items-start gap-8 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
      <section aria-label={tab === "plants" ? "Plantas" : "Entradas del diario"} className="min-w-0 max-h-80 overflow-y-auto border-y border-green-900/20 md:max-h-[42rem]">
        {items.length ? <ul className="divide-y divide-green-900/15">{items.map((item) => <li key={item.id}>
          <button type="button" disabled={busy} aria-pressed={draft?.id === item.id} onClick={() => editRecord(item)} className={`w-full px-3 py-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-700 ${draft?.id === item.id ? "bg-white/60" : "hover:bg-white/30"}`}>
            <span className="block break-words font-medium">{tab === "plants" ? item.commonName : item.title}</span>
            <span className="mt-1 block break-words text-sm text-green-800">{tab === "plants" ? item.scientificName : `${item.date} · ${records.plants.find((plant) => plant.id === item.plantId)?.commonName ?? ""}`}</span>
          </button>
        </li>)}</ul> : <p className="px-3 py-5 text-sm text-green-800">No hay {tab === "plants" ? "plantas" : "entradas"}.</p>}
      </section>
      {draft ? <form key={draft.id} onSubmit={saveRecord} className="min-w-0">
        <fieldset disabled={busy} className="min-w-0 space-y-5">
          <legend className="mb-5 text-xl font-medium">{isNew ? (tab === "plants" ? "Nueva planta" : "Nueva entrada") : (tab === "plants" ? "Editar planta" : "Editar entrada")}</legend>
          {tab === "plants" ? <>
            <div className="grid gap-4 sm:grid-cols-2">
              {plantFields.map(([name, label, required]) => <Field key={name} label={label}><input name={name} required={required} maxLength={200} value={draft[name] ?? ""} onChange={(event) => changeField(name, event.target.value)} className={inputClass} /></Field>)}
              <Field label="Categor&iacute;a"><select value={draft.category} onChange={(event) => changeField("category", event.target.value)} className={inputClass}>{categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></Field>
            </div>
            <Field label="Descripci&oacute;n"><textarea rows={5} maxLength={20000} value={draft.description ?? ""} onChange={(event) => changeField("description", event.target.value)} className={inputClass} /></Field>
          </> : <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="&Aacute;rbol"><select required value={draft.plantId} onChange={(event) => changeField("plantId", event.target.value)} className={inputClass}>{records.plants.map((plant) => <option key={plant.id} value={plant.id}>{plant.commonName}</option>)}</select></Field>
              <Field label="Fecha"><input type="date" required value={draft.date} onChange={(event) => changeField("date", event.target.value)} className={inputClass} /></Field>
            </div>
            <Field label="T&iacute;tulo"><input required maxLength={200} value={draft.title} onChange={(event) => changeField("title", event.target.value)} className={inputClass} /></Field>
            {[["description", "Trabajo realizado", true], ["observation", "Observaciones"], ["nextStep", "Siguiente paso"]].map(([name, label, required]) => <Field key={name} label={label}><textarea rows={name === "description" ? 6 : 3} required={required} maxLength={20000} value={draft[name] ?? ""} onChange={(event) => changeField(name, event.target.value)} className={inputClass} /></Field>)}
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={Boolean(draft.isMock)} onChange={(event) => changeField("isMock", event.target.checked)} className="size-4 accent-green-800" />Entrada de ejemplo</label>
          </>}
          <div className="border-t border-green-900/20 pt-5">
            <h3 className="text-base font-medium">{tab === "plants" ? "Foto principal" : "Fotos"}</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {photos.map((photo, index) => <div key={`${photo.src}-${index}`} className="min-w-0">
                <div className="relative aspect-[4/3] bg-green-900/5">
                  <img src={photo.src} alt={photo.alt || "Foto"} className="size-full object-contain" />
                  <button type="button" title="Quitar foto" aria-label={`Quitar foto ${index + 1}`} onClick={() => tab === "plants" ? changeField("image", "") : changeField("photos", photos.filter((_photo, photoIndex) => photoIndex !== index))} className="absolute top-2 right-2 flex size-11 items-center justify-center rounded bg-white/90 text-red-800 focus-visible:outline-2 focus-visible:outline-red-700"><X size={18} aria-hidden="true" /></button>
                </div>
                {tab === "journal" && <Field label={`Descripci\u00f3n de la foto ${index + 1}`}><input maxLength={300} value={photo.alt ?? ""} onChange={(event) => changeField("photos", photos.map((current, photoIndex) => photoIndex === index ? { ...current, alt: event.target.value } : current))} className={inputClass} /></Field>}
              </div>)}
            </div>
            <label className="mt-4 block text-sm text-green-900"><span className="flex items-center gap-2"><Upload size={18} aria-hidden="true" />{tab === "plants" ? "Subir foto" : "A\u00f1adir fotos"}</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple={tab === "journal"} onChange={uploadPhotos} className="mt-2 block w-full min-w-0 text-sm file:mr-3 file:rounded file:border file:border-green-900/30 file:bg-white/60 file:px-3 file:py-2 file:text-green-950" /></label>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-green-900/20 pt-5">
            <button type="submit" className={`${buttonClass} bg-green-800 text-white hover:bg-green-900`}><Save size={18} aria-hidden="true" />{busy ? "Guardando..." : "Guardar"}</button>
            <button type="button" onClick={() => { if (canDiscard()) { setDraft(null); setDirty(false); } }} className={buttonClass}>Cancelar</button>
            {!isNew && <button type="button" onClick={deleteRecord} className={`${buttonClass} text-red-800`}><Trash2 size={18} aria-hidden="true" />Eliminar</button>}
            {!isNew && <a href={tab === "plants" ? `/arbolario/${draft.id}` : `/arbolario/${draft.plantId}#${draft.id}`} target="_blank" rel="noopener noreferrer" className={buttonClass}><ArrowUpRight size={18} aria-hidden="true" />Ver publicado</a>}
            {dirty && <span className="text-sm text-green-800">Cambios sin guardar</span>}
          </div>
        </fieldset>
      </form> : <p className="py-4 text-sm text-green-800">Ning&uacute;n elemento seleccionado.</p>}
    </div>
  </div>;
}