"use client";

import { ChangeEvent, useMemo, useState } from "react";

type FormData = {
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientCompanyName: string;
  clientFacilityAddress: string;
  region: string;
  sector: string;
  facilityType: string;
  energyStrategy: string;
  energyStrategyNotes: string;
  investments: string[];
  verificationAndResults: string;
  mainIssues: string[];
  employees: string;
  operatingHours: string;
  floors: string;
  incomers: string;
  distributionBoards: string;
  keyAssetsToMonitor: string;
  elecSpendUsd12m: string;
  elecKwh12m: string;
  gasSpendUsd12m: string;
  gasKwh12m: string;
  hasRenewables: "" | "yes" | "no";
  facilityM2: string;
  ecmsCompleted: string[];
  ecmsNotes: string;
  annualProduction: string;
  renewableKwhGeneratedAnnual: string;
};

const defaultData: FormData = {
  clientFirstName: "",
  clientLastName: "",
  clientEmail: "",
  clientCompanyName: "",
  clientFacilityAddress: "",
  region: "",
  sector: "",
  facilityType: "",
  energyStrategy: "",
  energyStrategyNotes: "",
  investments: [],
  verificationAndResults: "",
  mainIssues: [],
  employees: "",
  operatingHours: "",
  floors: "",
  incomers: "",
  distributionBoards: "",
  keyAssetsToMonitor: "",
  elecSpendUsd12m: "",
  elecKwh12m: "",
  gasSpendUsd12m: "",
  gasKwh12m: "",
  hasRenewables: "",
  facilityM2: "",
  ecmsCompleted: [],
  ecmsNotes: "",
  annualProduction: "",
  renewableKwhGeneratedAnnual: "",
};

const steps = [
  "Facility Snapshot",
  "Strategy & Reality Check",
  "Complexity & Monitoring Scope",
  "Energy Baseline + Uploads",
  "Final Scoreboard",
];

const multiOptions = {
  investments: ["Sub-metering", "Controls upgrades", "Retrofits", "M&V program", "No current investments"],
  issues: ["Lack of visibility", "High demand spikes", "Rising utility costs", "No baseline", "Unverified savings"],
  ecms: ["LED upgrade", "HVAC optimization", "Compressed air fixes", "Power factor correction", "BMS tuning"],
};

const impactTips = [
  "Solid facility details improve benchmarking confidence and routing accuracy.",
  "Strategy answers unlock faster diagnostics and reveal short-term win potential.",
  "Complexity mapping helps size metering architecture and deployment effort.",
  "Baseline + uploads unlock visibility and sharpen savings verification pathways.",
];

function toNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [uploadSitePlan, setUploadSitePlan] = useState<File | null>(null);
  const [uploadEnergyBills, setUploadEnergyBills] = useState<File | null>(null);
  const [step, setStep] = useState(0);

  const facilityComplete = [
    formData.clientFirstName,
    formData.clientLastName,
    formData.clientEmail,
    formData.clientCompanyName,
    formData.clientFacilityAddress,
    formData.region,
    formData.sector,
    formData.facilityType,
  ].every(Boolean);

  const strategyAnswers = [formData.energyStrategy, formData.investments.length ? "x" : "", formData.verificationAndResults, formData.mainIssues.length ? "x" : ""].filter(Boolean).length;
  const complexityComplete = [
    formData.employees,
    formData.operatingHours,
    formData.floors,
    formData.incomers,
    formData.distributionBoards,
    formData.keyAssetsToMonitor,
  ].every(Boolean);
  const baselineComplete = [
    formData.elecSpendUsd12m,
    formData.elecKwh12m,
    formData.hasRenewables,
    formData.facilityM2,
  ].every(Boolean) && (formData.hasRenewables !== "yes" || Boolean(formData.renewableKwhGeneratedAnnual));

  const confidence = Math.min(
    100,
    (facilityComplete ? 10 : 0) +
      Math.min(strategyAnswers * 5, 20) +
      (complexityComplete ? 15 : 0) +
      (baselineComplete ? 20 : 0) +
      (uploadSitePlan ? 25 : 0) +
      (uploadEnergyBills ? 30 : 0)
  );

  const opportunity = useMemo(() => {
    if (["None", "Utility bill tracking only"].includes(formData.energyStrategy) || formData.mainIssues.includes("Lack of visibility")) return "High";
    if (["Partial monitoring", "Basic initiatives"].includes(formData.energyStrategy)) return "Medium";
    if (["Formal EnMS", "ISO 50001"].includes(formData.energyStrategy) && formData.verificationAndResults) return "Low/Medium";
    return "Medium";
  }, [formData.energyStrategy, formData.mainIssues, formData.verificationAndResults]);

  const level = confidence < 25 ? "Bronze" : confidence < 50 ? "Silver" : confidence < 75 ? "Gold" : "Platinum";

  const badges = [
    (uploadEnergyBills || (formData.elecKwh12m && formData.elecSpendUsd12m)) && "Visibility Unlocked",
    uploadSitePlan && "Map Ready",
    formData.elecKwh12m && formData.elecSpendUsd12m && "Baseline Built",
    complexityComplete && "Asset Focused",
    strategyAnswers >= 3 && "Strategy Clarity",
  ].filter(Boolean) as string[];

  const completedSteps = [facilityComplete, strategyAnswers >= 3, complexityComplete, baselineComplete].filter(Boolean).length;

  const complexityRating = (() => {
    const total = toNumber(formData.floors) + toNumber(formData.incomers) + toNumber(formData.distributionBoards) + toNumber(formData.keyAssetsToMonitor);
    if (total >= 40) return "Complex";
    if (total >= 20) return "Medium";
    return "Simple";
  })();

  const topOpportunities = useMemo(() => {
    const list = [
      !uploadEnergyBills && "Collect and digitize 12 months of utility bills for granular trend detection.",
      formData.mainIssues.includes("Lack of visibility") && "Deploy sub-metering at major loads to unlock real-time visibility.",
      ["None", "Utility bill tracking only"].includes(formData.energyStrategy) && "Launch a formal energy strategy with KPI targets and monthly cadence.",
      toNumber(formData.keyAssetsToMonitor) > 8 && "Prioritize top energy-intensive assets first for phased monitoring rollout.",
      !formData.verificationAndResults && "Implement M&V verification workflow to prove savings and de-risk future investment.",
      toNumber(formData.elecKwh12m) > 1000000 && "Run load profiling to identify peak shaving and demand response opportunities.",
      formData.ecmsCompleted.length < 2 && "Create ECM backlog with payback ranking to accelerate low-capex wins.",
    ].filter(Boolean) as string[];
    return list.slice(0, 5);
  }, [formData, uploadEnergyBills]);

  const updateField = (key: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleMulti = (field: "investments" | "mainIssues" | "ecmsCompleted", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const canNext = [facilityComplete, strategyAnswers >= 3, complexityComplete, baselineComplete][step] ?? false;

  const fileInput = (
    label: string,
    accepted: string,
    file: File | null,
    setter: (file: File | null) => void
  ) => (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <label className="font-medium">{label}</label>
      <input
        type="file"
        accept={accepted}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setter(event.target.files?.[0] ?? null)}
        className="mt-2 block w-full text-sm"
      />
      {file && (
        <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
          <span>{file.name}</span>
          <button className="text-rose-700" onClick={() => setter(null)}>
            Remove
          </button>
        </div>
      )}
    </div>
  );

  const textInput = (label: string, key: keyof FormData, required = false, type = "text") => (
    <label className="grid gap-1 text-sm">
      <span className="font-medium">{label}{required ? " *" : ""}</span>
      <input
        type={type}
        value={String(formData[key])}
        onChange={(e) => updateField(key, e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2"
      />
    </label>
  );

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-8">
      <header className="sticky top-0 z-10 mb-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-5">
          <Stat title="Confidence Score" value={`${confidence}/100`} />
          <Stat title="Opportunity" value={opportunity} />
          <Stat title="Level" value={level} />
          <Stat title="Progress" value={`${completedSteps}/4`} />
          <div>
            <p className="text-xs uppercase text-slate-600">Badges</p>
            <p className="text-sm font-semibold">{badges.length || 0} earned</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Level {Math.min(step + 1, 5)}</p>
          <h1 className="mb-4 text-2xl font-bold">{steps[step]}</h1>

          {step === 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              {textInput("First name", "clientFirstName", true)}
              {textInput("Last name", "clientLastName", true)}
              {textInput("Email", "clientEmail", true, "email")}
              {textInput("Company", "clientCompanyName", true)}
              <div className="md:col-span-2">{textInput("Facility address", "clientFacilityAddress", true)}</div>
              <Select label="Region *" value={formData.region} onChange={(v) => updateField("region", v)} options={["", "North America", "EMEA", "APAC", "LATAM"]} note="TODO: replace with production region list." />
              <Select label="Sector *" value={formData.sector} onChange={(v) => updateField("sector", v)} options={["", "Manufacturing", "Logistics", "Commercial", "Food & Beverage"]} note="TODO: replace with sector taxonomy." />
              <Select label="Facility type *" value={formData.facilityType} onChange={(v) => updateField("facilityType", v)} options={["", "Plant", "Warehouse", "Office", "Campus"]} note="TODO: replace with facility type catalog." />
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-3">
              <Select label="Energy strategy" value={formData.energyStrategy} onChange={(v) => updateField("energyStrategy", v)} options={["", "None", "Utility bill tracking only", "Partial monitoring", "Basic initiatives", "Formal EnMS", "ISO 50001"]} />
              {textInput("Energy strategy notes (optional)", "energyStrategyNotes")}
              <MultiPills label="Investments" options={multiOptions.investments} values={formData.investments} onToggle={(v) => toggleMulti("investments", v)} />
              <label className="grid gap-1 text-sm">
                <span className="font-medium">Verification and results</span>
                <textarea className="rounded-lg border border-slate-300 px-3 py-2" rows={3} value={formData.verificationAndResults} onChange={(e) => updateField("verificationAndResults", e.target.value)} />
              </label>
              <MultiPills label="Main issues" options={multiOptions.issues} values={formData.mainIssues} onToggle={(v) => toggleMulti("mainIssues", v)} />
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3 md:grid-cols-2">
              {textInput("Employees", "employees", true, "number")}
              {textInput("Operating hours", "operatingHours", true)}
              {textInput("Floors", "floors", true, "number")}
              {textInput("Incomers", "incomers", true, "number")}
              {textInput("Distribution boards", "distributionBoards", true, "number")}
              {textInput("Key assets to monitor", "keyAssetsToMonitor", true, "number")}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-3 md:grid-cols-2">
              {textInput("Electricity spend (USD, 12m)", "elecSpendUsd12m", true, "number")}
              {textInput("Electricity kWh (12m)", "elecKwh12m", true, "number")}
              {textInput("Gas spend (USD, 12m) or N/A", "gasSpendUsd12m", false, "text")}
              {textInput("Gas kWh (12m) or N/A", "gasKwh12m", false, "text")}
              <Select label="Has renewables *" value={formData.hasRenewables} onChange={(v) => updateField("hasRenewables", v)} options={["", "yes", "no"]} />
              {textInput("Facility area (m²)", "facilityM2", true, "number")}
              {formData.hasRenewables === "yes" && textInput("Renewable kWh generated annually", "renewableKwhGeneratedAnnual", true, "number")}
              {textInput("Annual production (optional)", "annualProduction")}
              <div className="md:col-span-2">
                <MultiPills label="ECMs completed" options={multiOptions.ecms} values={formData.ecmsCompleted} onToggle={(v) => toggleMulti("ecmsCompleted", v)} />
              </div>
              <label className="md:col-span-2 grid gap-1 text-sm">
                <span className="font-medium">ECM notes</span>
                <textarea className="rounded-lg border border-slate-300 px-3 py-2" rows={3} value={formData.ecmsNotes} onChange={(e) => updateField("ecmsNotes", e.target.value)} />
              </label>
              <div className="md:col-span-2 grid gap-3 md:grid-cols-2">
                {fileInput("Upload site plan", ".pdf,.jpg,.jpeg,.png,.dwg", uploadSitePlan, setUploadSitePlan)}
                {fileInput("Upload energy bills", ".pdf,.xlsx,.csv", uploadEnergyBills, setUploadEnergyBills)}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p><strong>Confidence:</strong> {confidence}/100</p>
                <p><strong>Level:</strong> {level}</p>
                <p><strong>Opportunity:</strong> {opportunity}</p>
                <p><strong>Complexity rating:</strong> {complexityRating}</p>
              </div>
              <div>
                <h2 className="font-semibold">Badges earned</h2>
                <ul className="list-disc pl-6">
                  {badges.map((badge) => <li key={badge}>{badge}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="font-semibold">Top 5 likely opportunity areas</h2>
                <ol className="list-decimal space-y-1 pl-6">
                  {topOpportunities.map((item) => <li key={item}>{item}</li>)}
                </ol>
              </div>
            </div>
          )}

          {step < 4 && (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              <p className="font-semibold">Impact Card</p>
              <p>{impactTips[step]}</p>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))} className="rounded-lg border border-slate-300 px-4 py-2 disabled:opacity-40">
              Back
            </button>
            {step < 4 ? (
              <button disabled={!canNext} onClick={() => setStep((s) => s + 1)} className="rounded-lg bg-indigo-700 px-4 py-2 text-white disabled:bg-indigo-300">
                Next
              </button>
            ) : (
              <button onClick={() => { setStep(0); setFormData(defaultData); setUploadEnergyBills(null); setUploadSitePlan(null); }} className="rounded-lg bg-slate-800 px-4 py-2 text-white">
                Start over
              </button>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold uppercase">Badges panel</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Visibility Unlocked",
                "Map Ready",
                "Baseline Built",
                "Asset Focused",
                "Strategy Clarity",
              ].map((badge) => (
                <li key={badge} className={`rounded-lg px-3 py-2 ${badges.includes(badge) ? "bg-indigo-100 text-indigo-800" : "bg-slate-100 text-slate-500"}`}>
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-slate-600">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function Select({ label, value, onChange, options, note }: { label: string; value: string; onChange: (value: string) => void; options: string[]; note?: string }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
        {options.map((option) => (
          <option key={option || "blank"} value={option}>
            {option || "Select..."}
          </option>
        ))}
      </select>
      {note && <span className="text-xs text-amber-700">{note}</span>}
    </label>
  );
}

function MultiPills({ label, options, values, onToggle }: { label: string; options: string[]; values: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="grid gap-2 text-sm">
      <span className="font-medium">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onToggle(option)}
            className={`rounded-full border px-3 py-1 text-xs ${values.includes(option) ? "border-indigo-600 bg-indigo-100 text-indigo-800" : "border-slate-300 text-slate-700"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
