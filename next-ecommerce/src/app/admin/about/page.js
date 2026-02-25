"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    missionTitle: "",
    missionText: "",
    visionText: "",
    missionImage: "",
    whyChooseTitle: "",
    whyChooseItems: [""],
    whyChooseImage: "",
    termsTitle: "",
    termsText: "",
    termsImage: "",
    contactTitle: "",
    contactAddress: "",
    contactPhone: "",
    contactEmail: "",
    contactImage: "",
    teamTitle: "",
    team: [{ name: "", role: "", image: "" }],
  });

  useEffect(() => {
    fetch("/api/admin/pages/about", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            missionTitle: data.missionTitle ?? "",
            missionText: data.missionText ?? "",
            visionText: data.visionText ?? "",
            missionImage: data.missionImage ?? "",
            whyChooseTitle: data.whyChooseTitle ?? "",
            whyChooseItems: Array.isArray(data.whyChooseItems) && data.whyChooseItems.length ? data.whyChooseItems : [""],
            whyChooseImage: data.whyChooseImage ?? "",
            termsTitle: data.termsTitle ?? "",
            termsText: data.termsText ?? "",
            termsImage: data.termsImage ?? "",
            contactTitle: data.contactTitle ?? "",
            contactAddress: data.contactAddress ?? "",
            contactPhone: data.contactPhone ?? "",
            contactEmail: data.contactEmail ?? "",
            contactImage: data.contactImage ?? "",
            teamTitle: data.teamTitle ?? "",
            team: Array.isArray(data.team) && data.team.length ? data.team : [{ name: "", role: "", image: "" }],
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateWhyChooseItem(i, val) {
    setForm((prev) => {
      const arr = [...(prev.whyChooseItems || [])];
      arr[i] = val;
      return { ...prev, whyChooseItems: arr };
    });
  }

  function addWhyChooseItem() {
    setForm((prev) => ({ ...prev, whyChooseItems: [...(prev.whyChooseItems || []), ""] }));
  }

  function removeWhyChooseItem(i) {
    setForm((prev) => ({
      ...prev,
      whyChooseItems: (prev.whyChooseItems || []).filter((_, idx) => idx !== i),
    }));
  }

  function updateTeam(i, field, val) {
    setForm((prev) => {
      const arr = [...(prev.team || [])];
      arr[i] = { ...arr[i], [field]: val };
      return { ...prev, team: arr };
    });
  }

  function addTeamMember() {
    setForm((prev) => ({ ...prev, team: [...(prev.team || []), { name: "", role: "", image: "" }] }));
  }

  function removeTeamMember(i) {
    setForm((prev) => ({ ...prev, team: (prev.team || []).filter((_, idx) => idx !== i) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        whyChooseItems: (form.whyChooseItems || []).filter(Boolean),
        team: (form.team || []).filter((t) => t.name || t.role || t.image),
      };
      const res = await fetch("/api/admin/pages/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (res.ok) alert("About Us page saved.");
      else alert((await res.json()).error || "Failed to save");
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  const inputCls = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">About Us Page</h1>
      <p className="text-sm text-gray-600">Edit the content shown on the public About Us page.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Mission & Vision</h2>
          <div>
            <label className={labelCls}>Section Title</label>
            <input type="text" value={form.missionTitle} onChange={(e) => set("missionTitle", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Mission Text</label>
            <textarea value={form.missionText} onChange={(e) => set("missionText", e.target.value)} rows={2} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Vision Text</label>
            <textarea value={form.visionText} onChange={(e) => set("visionText", e.target.value)} rows={2} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Mission Image URL</label>
            <input type="url" value={form.missionImage} onChange={(e) => set("missionImage", e.target.value)} className={inputCls} />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Why Choose Us</h2>
          <div>
            <label className={labelCls}>Section Title</label>
            <input type="text" value={form.whyChooseTitle} onChange={(e) => set("whyChooseTitle", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Bullet Items (one per line)</label>
            {(form.whyChooseItems || [""]).map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" value={item} onChange={(e) => updateWhyChooseItem(i, e.target.value)} className={inputCls} placeholder="e.g. Fast delivery" />
                <button type="button" onClick={() => removeWhyChooseItem(i)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={addWhyChooseItem} className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
              <Plus className="w-4 h-4" /> Add item
            </button>
          </div>
          <div>
            <label className={labelCls}>Image URL</label>
            <input type="url" value={form.whyChooseImage} onChange={(e) => set("whyChooseImage", e.target.value)} className={inputCls} />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Terms & Conditions</h2>
          <div>
            <label className={labelCls}>Section Title</label>
            <input type="text" value={form.termsTitle} onChange={(e) => set("termsTitle", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Terms Text</label>
            <textarea value={form.termsText} onChange={(e) => set("termsText", e.target.value)} rows={3} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Image URL</label>
            <input type="url" value={form.termsImage} onChange={(e) => set("termsImage", e.target.value)} className={inputCls} />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Contact Section (on About page)</h2>
          <div>
            <label className={labelCls}>Section Title</label>
            <input type="text" value={form.contactTitle} onChange={(e) => set("contactTitle", e.target.value)} className={inputCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Address</label>
              <input type="text" value={form.contactAddress} onChange={(e) => set("contactAddress", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input type="text" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Contact Image URL</label>
            <input type="url" value={form.contactImage} onChange={(e) => set("contactImage", e.target.value)} className={inputCls} />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Team</h2>
          <div>
            <label className={labelCls}>Section Title</label>
            <input type="text" value={form.teamTitle} onChange={(e) => set("teamTitle", e.target.value)} className={inputCls} />
          </div>
          {(form.team || []).map((member, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input type="text" value={member.name} onChange={(e) => updateTeam(i, "name", e.target.value)} className={inputCls} placeholder="Name" />
                <input type="text" value={member.role} onChange={(e) => updateTeam(i, "role", e.target.value)} className={inputCls} placeholder="Role" />
                <input type="url" value={member.image} onChange={(e) => updateTeam(i, "image", e.target.value)} className={inputCls} placeholder="Image URL" />
              </div>
              <button type="button" onClick={() => removeTeamMember(i)} className="text-sm text-red-600 hover:underline">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addTeamMember} className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
            <Plus className="w-4 h-4" /> Add team member
          </button>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving..." : "Save About Us"}
          </button>
        </div>
      </form>
    </div>
  );
}
