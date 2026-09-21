"use client";

import type { ReactNode } from "react";

export function Field({ label, value, onChange, help, required, type = "text", placeholder, min, max }: { label: string; value: string | number; onChange: (value: string) => void; help?: string; required?: boolean; type?: string; placeholder?: string; min?: number; max?: number }) {
  return <label className="admin-field"><span>{label}{required && <b aria-label="obligatorio"> *</b>}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} min={min} max={max} />{help && <small>{help}</small>}</label>;
}

export function TextArea({ label, value, onChange, help, rows = 4, required }: { label: string; value: string; onChange: (value: string) => void; help?: string; rows?: number; required?: boolean }) {
  return <label className="admin-field"><span>{label}{required && <b aria-label="obligatorio"> *</b>}</span><textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} required={required} />{help && <small>{help}</small>}</label>;
}

export function SelectField({ label, value, onChange, children, help }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode; help?: string }) {
  return <label className="admin-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{children}</select>{help && <small>{help}</small>}</label>;
}

export function Switch({ label, checked, onChange, help }: { label: string; checked: boolean; onChange: (checked: boolean) => void; help?: string }) {
  return <label className="admin-switch"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span aria-hidden="true" /><div><strong>{label}</strong>{help && <small>{help}</small>}</div></label>;
}

export function FieldGroup({ title, text, children, className = "" }: { title: string; text?: string; children: ReactNode; className?: string }) {
  return <section className={`admin-field-group ${className}`}><header><h3>{title}</h3>{text && <p>{text}</p>}</header><div className="admin-field-grid">{children}</div></section>;
}

export function StringList({ label, values, onChange, placeholder = "Nuevo elemento" }: { label: string; values: string[]; onChange: (values: string[]) => void; placeholder?: string }) {
  const update = (index: number, value: string) => onChange(values.map((item, itemIndex) => itemIndex === index ? value : item));
  const move = (index: number, direction: -1 | 1) => { const target = index + direction; if (target < 0 || target >= values.length) return; const next = [...values]; [next[index], next[target]] = [next[target], next[index]]; onChange(next); };
  return <div className="admin-repeater"><div className="admin-repeater-heading"><strong>{label}</strong><button type="button" onClick={() => onChange([...values, ""])}>＋ Añadir</button></div>{values.length === 0 && <p className="admin-empty-small">Todavía no hay elementos.</p>}{values.map((value, index) => <div className="admin-repeater-row" key={index}><input value={value} placeholder={placeholder} onChange={(event) => update(index, event.target.value)} /><div><button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Subir">↑</button><button type="button" onClick={() => move(index, 1)} disabled={index === values.length - 1} aria-label="Bajar">↓</button><button type="button" className="is-danger" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}>Quitar</button></div></div>)}</div>;
}

export function ObjectList({ label, values, fields, onChange }: { label: string; values: Array<Record<string, unknown>>; fields: Array<{ key: string; label: string; type?: string; placeholder?: string }>; onChange: (values: Array<Record<string, unknown>>) => void }) {
  const update = (index: number, key: string, value: string | boolean) => onChange(values.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const move = (index: number, direction: -1 | 1) => { const target = index + direction; if (target < 0 || target >= values.length) return; const next = [...values]; [next[index], next[target]] = [next[target], next[index]]; onChange(next); };
  return <div className="admin-repeater"><div className="admin-repeater-heading"><strong>{label}</strong><button type="button" onClick={() => onChange([...values, Object.fromEntries(fields.map((field) => [field.key, field.type === "checkbox" ? true : ""]))])}>＋ Añadir</button></div>{values.length === 0 && <p className="admin-empty-small">Todavía no hay elementos.</p>}{values.map((item, index) => <article className="admin-repeater-card" key={index}><div className="admin-repeater-card-fields">{fields.map((field) => field.type === "checkbox" ? <Switch key={field.key} label={field.label} checked={item[field.key] !== false} onChange={(value) => update(index, field.key, value)} /> : field.type === "textarea" ? <TextArea key={field.key} label={field.label} value={String(item[field.key] ?? "")} onChange={(value) => update(index, field.key, value)} rows={3} /> : <Field key={field.key} label={field.label} type={field.type} value={String(item[field.key] ?? "")} placeholder={field.placeholder} onChange={(value) => update(index, field.key, value)} />)}</div><footer><button type="button" onClick={() => move(index, -1)} disabled={index === 0}>↑ Subir</button><button type="button" onClick={() => move(index, 1)} disabled={index === values.length - 1}>↓ Bajar</button><button type="button" className="is-danger" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}>Quitar</button></footer></article>)}</div>;
}
