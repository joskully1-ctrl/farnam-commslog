import { useState, useEffect } from 'react'
import { db, supabase, mapEntry } from './supabase'

// ── Brand ────────────────────────────────────────────────────────────────────
const BRAND = {
  dark:'#163242', mid:'#1E4D63', accent:'#3A7A90', light:'#EBF4F7', subtle:'#D4E9EF',
}

// ── Static org data ──────────────────────────────────────────────────────────
const INITIAL_ORGS = [
  { id:1,  name:'Greater Hartford Legal Aid (GHLA)', priority:1, address:'Hartford, CT', website:'www.ghla.org', mission:'Nonprofit law office providing free civil legal services to low-income people and seniors in the Hartford area; advocates to improve housing systems and policies.', housingWork:'Legal representation in eviction and habitability cases; systemic housing reform; covers 25 Greater Hartford towns.', contactFirst:'Leadership', contactLast:'', title:'Executive Director', phone:'', email:'' },
  { id:2,  name:'Greater Hartford Interfaith Action Alliance (GHIAA)', priority:1, address:'47 Vine Street, Hartford, CT 06112', website:'cljct.org/ghiaa', mission:'52 diverse faith communities and allied institutions organizing together for justice in Greater Hartford.', housingWork:'Campaigns against slumlords; helped residents attain safe, affordable housing; Clean Slate legislation.', contactFirst:'Rev. Jocelyn', contactLast:'Gardner Spencer', title:'Lead Organizer', phone:'860-527-9860 x108', email:'jgardnerspencer@cljct.org' },
  { id:3,  name:'Hartford Fair Rent Commission', priority:1, address:'City of Hartford, CT', website:'hartfordct.gov', mission:'Municipal body that receives tenant complaints about unfair rent increases and unsafe conditions; issues orders to repair and lower rent.', housingWork:'Processes FRC complaints; issues repair orders; rent reduction orders. Key data source for Housing Distress Index.', contactFirst:'Petrel', contactLast:'Maylor', title:'Deputy Director, Public Works / 311 Supervisor', phone:'', email:'maylp002@hartford.gov' },
  { id:4,  name:'CT Fair Housing Center (CTFHC)', priority:1, address:'60 Popieluszko Court, Hartford, CT 06106', website:'ctfairhousing.org', mission:'Ensures all people have equal access to housing in CT, free from discrimination. Free investigative and legal services statewide.', housingWork:'Free legal services for renters; tenant organizing; policy advocacy against discrimination and exploitation; systems investigations.', contactFirst:'Leadership', contactLast:'', title:'Executive Director', phone:'860-247-4236', email:'info@ctfairhousing.org' },
  { id:5,  name:'Partnership for Strong Communities (PSC)', priority:1, address:'227 Lawrence Street, Hartford, CT 06106', website:'pschousing.org', mission:'Promotes equitable change in CT housing policy through advocacy, research, and diverse partner networks. CT affiliate of NLIHC.', housingWork:'Statewide policy coordination; housing affordability research; federal NLIHC advocacy connection.', contactFirst:'Danielle', contactLast:'Hubley', title:'Advocacy and Education Manager', phone:'860-244-0066', email:'dhubley@pschousing.org' },
  { id:6,  name:'Open Communities Alliance (OCA)', priority:1, address:'Hartford, CT', website:'ctoca.org', mission:"Civil rights organization focused on unwinding CT's history of segregation; promotes access to opportunity for low-income families of color.", housingWork:"CT Zoning Opportunity Data Portal; 'Out of Balance' research; Growing Together CT coalition; Fair Share housing proposal; impact litigation.", contactFirst:'Erin', contactLast:'Boggs', title:'Executive Director', phone:'', email:'' },
  { id:7,  name:'CT Data Collaborative', priority:1, address:'Connecticut (statewide)', website:'ctdata.org', mission:'Open data organization; maintains statewide eviction tracking tool and housing data resources.', housingWork:'Eviction analysis tool; 2022 Evictions Report; Housing Distress Index (project lead).', contactFirst:'Leadership', contactLast:'', title:'Executive Director', phone:'', email:'' },
  { id:8,  name:'Journey Home', priority:2, address:'591 New Park Ave, West Hartford, CT', website:'journeyhomect.org', mission:"Coordinates the Capital Region's system for ending homelessness through service providers, government, and community partners.", housingWork:'Manages Coordinated Access Network (CAN); Encampment to Housing initiative; landlord partnerships.', contactFirst:'Sarah', contactLast:'Pavone', title:'Director of Strategy', phone:'', email:'' },
  { id:9,  name:'Connecticut Tenants Union (CTTU)', priority:2, address:'Statewide, CT', website:'', mission:'Brings together tenants, unions, and associations statewide to demand stronger tenant rights and end displacement.', housingWork:'Tenant union formation and support; legislative advocacy for rent control and eviction protections; community education.', contactFirst:'Leadership', contactLast:'', title:'Director', phone:'', email:'' },
  { id:10, name:'Affordable Housing Alliance of CT (AHACT)', priority:2, address:'Connecticut (statewide)', website:'ahact.org', mission:'Founded 1981; represents 250+ member organizations — nonprofit developers, housing agencies, resident associations, and advocates.', housingWork:'Annual statewide housing conference; Housing Trust Fund; Affordable Housing Appeals Procedure; national LIHTC advocacy.', contactFirst:'Leadership', contactLast:'', title:'Executive Director', phone:'', email:'' },
  { id:11, name:'DataHaven', priority:2, address:'New Haven, CT', website:'ctdatahaven.org', mission:"CT's leading community data organization; compiles well-being data with focus on equity and neighborhood-level analysis.", housingWork:'Neighborhood-level housing, health, income, and education data; equity-focused research.', contactFirst:'Leadership', contactLast:'', title:'Executive Director', phone:'', email:'' },
  { id:12, name:'North Hartford NRZs (Clay Arsenal, Northeast, Upper Albany)', priority:2, address:'North Hartford, CT', website:'hartfordct.gov', mission:'Resident-led Neighborhood Revitalization Zones that develop and implement neighborhood improvement plans in North Hartford.', housingWork:'Community-level housing conditions advocacy; neighborhood planning; resident engagement in target geography.', contactFirst:'Leadership (varies by NRZ)', contactLast:'', title:'NRZ Chair', phone:'', email:'' },
  { id:13, name:'ACLU of Connecticut — Housing Program', priority:3, address:'Hartford, CT', website:'acluct.org/issues/housing', mission:'Seeks to end housing discrimination, advance tenant rights legislation, establish a right to housing in CT law.', housingWork:'Tenant rights legislation; fighting discrimination against people with records; opposing criminalization of homelessness.', contactFirst:'Leadership', contactLast:'', title:'Executive Director', phone:'', email:'' },
  { id:14, name:'LISC Connecticut', priority:3, address:'Hartford, New Haven, Bridgeport, CT', website:'lisc.org/connecticut', mission:'Community development finance; $94M+ invested in CT since 1984 to develop affordable housing and strengthen neighborhoods.', housingWork:'Affordable housing development; neighborhood investment; closing racial wealth and health gaps in Hartford and other CT cities.', contactFirst:'Leadership', contactLast:'', title:'CT Program Director', phone:'', email:'' },
  { id:15, name:'The Housing Collective / Centers for Housing Opportunity', priority:3, address:'Connecticut (statewide)', website:'cho.thehousingcollective.org', mission:'Leads regional Centers for Housing Opportunity — coalitions of practitioners, policymakers, residents, and community orgs.', housingWork:'Regional housing coalition infrastructure; right-to-counsel program hub; affordable housing advocacy; policy coordination.', contactFirst:'David', contactLast:'Rich', title:'Chief Executive Officer', phone:'', email:'' },
  { id:16, name:'Hartford Foundation for Public Giving', priority:3, address:'Hartford, CT', website:'hfpg.org', mission:"CT's largest community foundation; focused on reducing racial and economic inequities in Greater Hartford.", housingWork:'Major funder of housing, equity, and community development initiatives; OCA and CT Data Collaborative partner.', contactFirst:'Leadership', contactLast:'', title:'President / CEO', phone:'', email:'' },
  { id:17, name:'Hands On Hartford — Supportive Housing', priority:3, address:'Hartford, CT', website:'handsonhartford.org', mission:'Provides intensive case management to 100+ tenants in Greater Hartford at risk of homelessness.', housingWork:'Direct supportive housing services; focuses on intersection of health, housing, and poverty.', contactFirst:'Leadership', contactLast:'', title:'Executive Director', phone:'', email:'' },
  { id:18, name:'Community Housing Advocates (CHA) / Mercy Housing', priority:3, address:'Hartford and Middlesex Counties, CT', website:'ctcha.org', mission:'Umbrella org overseeing Mercy Housing and Shelter and My Sister\'s Place; eliminates homelessness and housing insecurity.', housingWork:'Affordable housing, homelessness prevention, supportive services for families, seniors, veterans, and people with disabilities.', contactFirst:'Leadership', contactLast:'', title:'Executive Director', phone:'', email:'' },
  { id:19, name:'Connecticut Legal Services (CLS)', priority:3, address:'Statewide, CT', website:'ctlawhelp.org', mission:'Provides access to justice and protects civil legal rights of low-income individuals and families; serves 122 of 169 CT communities.', housingWork:'Free civil legal representation and systemic advocacy on housing for low-income residents across CT.', contactFirst:'Leadership', contactLast:'', title:'Executive Director', phone:'', email:'' },
  { id:20, name:'Center for Leadership & Justice (CLJ)', priority:3, address:'47 Vine Street, Hartford, CT 06112', website:'cljct.org', mission:'Parent organization of GHIAA; supports faith communities and institutions to organize for justice across Greater Hartford.', housingWork:'Faith-based organizing for housing justice; racial justice campaigns; civic engagement in North Hartford.', contactFirst:'Leadership', contactLast:'', title:'Executive Director', phone:'860-527-9860', email:'' },
]

const STATUS_OPTIONS = ['Not Started','In Research','Ready to Contact','Contacted – Awaiting Response','Meeting Scheduled','Advisor Confirmed','Partner Confirmed','Declined','On Hold']
const STATUS_COLORS  = { 'Not Started':'bg-gray-100 text-gray-600','In Research':'bg-blue-100 text-blue-700','Ready to Contact':'bg-yellow-100 text-yellow-700','Contacted – Awaiting Response':'bg-orange-100 text-orange-700','Meeting Scheduled':'bg-purple-100 text-purple-700','Advisor Confirmed':'bg-green-100 text-green-700','Partner Confirmed':'bg-emerald-100 text-emerald-700','Declined':'bg-red-100 text-red-700','On Hold':'bg-slate-100 text-slate-600' }
const NEXT_STEP_OPTIONS = ['Send Introduction Email','Follow Up on Email','Schedule Meeting','Prepare Briefing Materials','Send Follow-Up After Meeting','Share Project Overview','Request Data / Materials','Await Response','Research Organization','No Action Needed','Other']
const TIER_COLORS = { 1:'bg-green-100 text-green-700', 2:'bg-blue-100 text-blue-700', 3:'bg-purple-100 text-purple-700', 'X':'bg-gray-100 text-gray-400 line-through' }
const TIER_LABELS = { 1:'T1', 2:'T2', 3:'T3', X:'✕' }
const TEAM_DEFAULT = ['Jim','Joanne','Illisa','Daniel','Corrie']

const fmtDate = d => { if(!d) return null; const[y,m,day]=d.split('-'); return `${m}/${day}/${y}` }
const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400'
const lbl = 'text-xs font-medium text-gray-500 block mb-1'

// ── Small shared components ───────────────────────────────────────────────────

function StatusBadge({ status }) {
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_COLORS[status]||'bg-gray-100 text-gray-600'}`}>{status}</span>
}

function TierBadge({ priority, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(o => !o)} className={`px-2 py-0.5 rounded-full text-xs font-bold cursor-pointer hover:opacity-80 ${TIER_COLORS[priority]}`}>{TIER_LABELS[priority]}</button>
      {open && (
        <div className="absolute z-20 top-6 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex gap-1">
          {[1,2,3,'X'].map(t => (
            <button key={t} onClick={() => { onChange(t); setOpen(false) }} className={`px-2 py-1 rounded text-xs font-bold ${TIER_COLORS[t]} ${priority===t?'ring-2 ring-offset-1 ring-slate-400':'hover:opacity-70'}`}>{TIER_LABELS[t]}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <span className="text-gray-300 ml-1">↕</span>
  return <span className="ml-1" style={{ color: BRAND.accent }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}

// ── Org Profile Panel ─────────────────────────────────────────────────────────

function OrgProfile({ org }) {
  const [open, setOpen] = useState(true)
  const contactName = [org.contactFirst, org.contactLast].filter(Boolean).join(' ')
  const websiteUrl  = org.website ? (org.website.startsWith('http') ? org.website : 'https://'+org.website) : null
  const hasContact  = contactName || org.phone || org.email
  return (
    <div className="bg-white rounded-xl overflow-hidden mb-4" style={{ border:`1px solid ${BRAND.subtle}` }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-3 hover:opacity-90" style={{ background:`linear-gradient(90deg,${BRAND.dark}ee,${BRAND.mid}ee)` }}>
        <span className="text-xs font-semibold uppercase tracking-widest text-white/80">Organization Profile</span>
        <span className="text-white/60 text-xs">{open ? '▲ Collapse' : '▼ Expand'}</span>
      </button>
      {open && (
        <div className="px-5 py-4 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color:BRAND.accent }}>Primary Contact</div>
              {hasContact ? (
                <div className="space-y-0.5">
                  {contactName && <div className="font-semibold text-slate-800">{contactName}</div>}
                  {org.title   && <div className="text-xs text-gray-500">{org.title}</div>}
                  {org.phone   && <div className="text-xs text-gray-600">📞 {org.phone}</div>}
                  {org.email   && <div className="text-xs"><span className="text-gray-400">✉ </span><a href={`mailto:${org.email}`} className="hover:underline" style={{ color:BRAND.accent }}>{org.email}</a></div>}
                </div>
              ) : <div className="text-xs text-gray-300 italic">No contact on file</div>}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color:BRAND.accent }}>Location &amp; Web</div>
              {org.address  && <div className="text-xs text-gray-600 mb-0.5">📍 {org.address}</div>}
              {websiteUrl   && <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline break-all" style={{ color:BRAND.accent }}>{org.website}</a>}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color:BRAND.accent }}>Mission</div>
              <p className="text-xs text-gray-600 leading-relaxed">{org.mission||'—'}</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color:BRAND.accent }}>Housing Work</div>
              <p className="text-xs text-gray-600 leading-relaxed">{org.housingWork||'—'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Entry form fields ─────────────────────────────────────────────────────────

function EntryFormFields({ form, set, team }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div><label className={lbl}>Date of Contact *</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inp}/></div>
      <div><label className={lbl}>Contactor *</label>
        <select value={form.contactor} onChange={e => set('contactor', e.target.value)} className={inp}>
          <option value="">— Select —</option>{team.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div><label className={lbl}>Person Contacted</label><input type="text" value={form.personContacted} onChange={e => set('personContacted', e.target.value)} placeholder="Name / Title at org" className={inp}/></div>
      <div><label className={lbl}>Status *</label>
        <select value={form.status} onChange={e => set('status', e.target.value)} className={inp}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="col-span-2"><label className={lbl}>Next Step</label>
        <select value={form.nextStep} onChange={e => set('nextStep', e.target.value)} className={inp}>
          <option value="">— Select —</option>{NEXT_STEP_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="col-span-2"><label className={lbl}>Notes</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="What happened? What was discussed or agreed?" className={inp+' resize-none'}/>
      </div>
    </div>
  )
}

// ── Log Entry Card ────────────────────────────────────────────────────────────

function LogEntryCard({ entry, team, onEdit, onDelete }) {
  const [editing, setEditing]           = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [form, setForm] = useState({ date:entry.date, personContacted:entry.personContacted||'', contactor:entry.contactor||'', notes:entry.notes||'', status:entry.status, nextStep:entry.nextStep||'' })
  const set = (k, v) => setForm(f => ({ ...f, [k]:v }))
  const handleSave = () => { if(!form.date||!form.contactor){alert('Date and Contactor required.'); return} onEdit(form); setEditing(false) }

  if (editing) return (
    <div className="bg-white rounded-xl p-4" style={{ border:`2px solid ${BRAND.accent}` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color:BRAND.accent }}>Editing Entry</span>
        <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600 text-xs">✕ Cancel</button>
      </div>
      <EntryFormFields form={form} set={set} team={team}/>
      <div className="flex justify-end mt-3"><button onClick={handleSave} className="text-xs px-4 py-2 text-white rounded-lg font-semibold" style={{ background:BRAND.mid }}>Save Changes</button></div>
    </div>
  )

  return (
    <div className="bg-white rounded-xl p-4 transition-colors group" style={{ border:`1px solid ${BRAND.subtle}` }}
      onMouseEnter={e => e.currentTarget.style.borderColor=BRAND.accent} onMouseLeave={e => e.currentTarget.style.borderColor=BRAND.subtle}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm" style={{ color:BRAND.dark }}>{fmtDate(entry.date)}</span>
          {entry.contactor && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">by {entry.contactor}</span>}
          {entry.personContacted && <span className="text-xs text-gray-400">→ <span className="text-slate-600">{entry.personContacted}</span></span>}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={entry.status}/>
          <button onClick={() => setEditing(true)} className="text-gray-300 hover:text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity" title="Edit">✏</button>
          {!confirmDelete
            ? <button onClick={() => setConfirmDelete(true)} className="text-gray-300 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            : <span className="text-xs text-red-500">Delete? <button onClick={onDelete} className="underline font-semibold">Yes</button> / <button onClick={() => setConfirmDelete(false)} className="underline">No</button></span>}
        </div>
      </div>
      {entry.notes   && <p className="text-xs text-slate-600 mb-2 leading-relaxed">{entry.notes}</p>}
      {entry.nextStep && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:BRAND.light, color:BRAND.mid }}>→ {entry.nextStep}</span>}
    </div>
  )
}

// ── Add Entry Form ────────────────────────────────────────────────────────────

function AddEntryForm({ orgName, orgs, team, onAdd, onCancel, showOrgSelector }) {
  const today = new Date().toISOString().split('T')[0]
  const [selId, setSelId] = useState(orgs?.[0]?.id || null)
  const [form, setForm]   = useState({ date:today, personContacted:'', contactor:'', notes:'', status:'Not Started', nextStep:'' })
  const set = (k, v) => setForm(f => ({ ...f, [k]:v }))
  const submit = () => {
    if (!form.date||!form.contactor) { alert('Please fill in Date of Contact and Contactor.'); return }
    if (showOrgSelector && !selId) { alert('Please select an organization.'); return }
    onAdd(form, showOrgSelector ? selId : undefined)
  }
  return (
    <div className="p-5">
      <h3 className="font-bold mb-4 text-sm" style={{ color:BRAND.dark }}>New Log Entry</h3>
      {showOrgSelector ? (
        <div className="mb-3"><label className={lbl}>Organization *</label>
          <select value={selId||''} onChange={e => setSelId(+e.target.value)} className={inp}>
            <option value="">— Select organization —</option>
            {(orgs||[]).map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>
      ) : (
        <div className="mb-3"><label className={lbl}>Organization</label><input value={orgName} disabled className={inp+' bg-gray-50 text-gray-500'}/></div>
      )}
      <EntryFormFields form={form} set={set} team={team}/>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onCancel} className="text-xs px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-slate-600">Cancel</button>
        <button onClick={submit} className="text-xs px-4 py-2 text-white rounded-lg font-semibold" style={{ background:BRAND.mid }}>Save Entry</button>
      </div>
    </div>
  )
}

// ── Add Org Form ──────────────────────────────────────────────────────────────

function AddOrgForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({ name:'', priority:'1', address:'', website:'', contactFirst:'', contactLast:'', title:'', phone:'', email:'', mission:'', housingWork:'' })
  const set = (k, v) => setForm(f => ({ ...f, [k]:v }))
  return (
    <div className="p-6">
      <h3 className="font-bold text-lg mb-1" style={{ color:BRAND.dark }}>Add New Organization</h3>
      <p className="text-xs text-gray-400 mb-5">Only Name and Tier are required.</p>
      <div className="space-y-4">
        <div><label className={lbl}>Organization Name *</label><input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full organization name" className={inp}/></div>
        <div><label className={lbl}>Priority Tier *</label>
          <div className="flex gap-2">
            {[['1','T1','bg-green-100 text-green-700'],['2','T2','bg-blue-100 text-blue-700'],['3','T3','bg-purple-100 text-purple-700']].map(([val,label,cls]) => (
              <button key={val} onClick={() => set('priority', val)} className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${form.priority===val?`${cls} border-current`:'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'}`}>{label}</button>
            ))}
          </div>
        </div>
        <div className="pt-1 border-t border-gray-100"><span className="text-xs font-semibold uppercase tracking-wide" style={{ color:BRAND.accent }}>Location &amp; Web</span></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={lbl}>Address</label><input type="text" value={form.address} onChange={e => set('address', e.target.value)} placeholder="City, ST" className={inp}/></div>
          <div><label className={lbl}>Website</label><input type="text" value={form.website} onChange={e => set('website', e.target.value)} placeholder="www.example.org" className={inp}/></div>
        </div>
        <div className="pt-1 border-t border-gray-100"><span className="text-xs font-semibold uppercase tracking-wide" style={{ color:BRAND.accent }}>Primary Contact</span></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={lbl}>First Name</label><input type="text" value={form.contactFirst} onChange={e => set('contactFirst', e.target.value)} className={inp}/></div>
          <div><label className={lbl}>Last Name</label><input type="text" value={form.contactLast} onChange={e => set('contactLast', e.target.value)} className={inp}/></div>
          <div><label className={lbl}>Title</label><input type="text" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Executive Director" className={inp}/></div>
          <div><label className={lbl}>Phone</label><input type="text" value={form.phone} onChange={e => set('phone', e.target.value)} className={inp}/></div>
          <div className="col-span-2"><label className={lbl}>Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inp}/></div>
        </div>
        <div className="pt-1 border-t border-gray-100"><span className="text-xs font-semibold uppercase tracking-wide" style={{ color:BRAND.accent }}>About</span></div>
        <div><label className={lbl}>Mission</label><textarea value={form.mission} onChange={e => set('mission', e.target.value)} rows={2} className={inp+' resize-none'}/></div>
        <div><label className={lbl}>Housing Work</label><textarea value={form.housingWork} onChange={e => set('housingWork', e.target.value)} rows={2} className={inp+' resize-none'}/></div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onCancel} className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-slate-600">Cancel</button>
        <button onClick={() => { if(!form.name.trim()){alert('Please enter an organization name.'); return} onAdd(form) }} className="text-sm px-4 py-2 text-white rounded-lg font-semibold" style={{ background:BRAND.mid }}>Add Organization</button>
      </div>
    </div>
  )
}

// ── Home View ─────────────────────────────────────────────────────────────────

function HomeView({ orgs, orgMeta, team, getEffPriority, getLatest, getOrgEntries, onOrgClick, onUpdateMeta }) {
  const [search,setSearch]   = useState('')
  const [fP,setFP]           = useState('all')
  const [fS,setFS]           = useState('all')
  const [fR,setFR]           = useState('all')
  const [sortCol,setSortCol] = useState('priority')
  const [sortDir,setSortDir] = useState('asc')

  const handleSort = col => { if(sortCol===col) setSortDir(d => d==='asc'?'desc':'asc'); else{setSortCol(col);setSortDir('asc')} }
  const tierOrder  = {1:1,2:2,3:3,X:4}

  const processed = orgs.filter(o => {
    const ep=getEffPriority(o), lat=getLatest(o.id), status=lat?.status||'Not Started', resp=orgMeta[o.id]?.responsible||''
    if(search&&!o.name.toLowerCase().includes(search.toLowerCase())) return false
    if(fP!=='all'&&String(ep)!==fP) return false
    if(fS!=='all'&&status!==fS) return false
    if(fR!=='all'&&resp!==fR) return false
    return true
  }).sort((a,b) => {
    const dir=sortDir==='asc'?1:-1, epA=getEffPriority(a), epB=getEffPriority(b), latA=getLatest(a.id), latB=getLatest(b.id)
    switch(sortCol){
      case 'name':        return dir*a.name.localeCompare(b.name)
      case 'priority':    return dir*((tierOrder[epA]||5)-(tierOrder[epB]||5))
      case 'responsible': return dir*((orgMeta[a.id]?.responsible||'').localeCompare(orgMeta[b.id]?.responsible||''))
      case 'lastContact': return dir*((latA?.date||'').localeCompare(latB?.date||''))
      case 'status':      return dir*((latA?.status||'').localeCompare(latB?.status||''))
      case 'nextStep':    return dir*((latA?.nextStep||'').localeCompare(latB?.nextStep||''))
      default: return 0
    }
  })

  const totalLogged = orgs.reduce((s,o) => s+getOrgEntries(o.id).length, 0)
  const contacted   = orgs.filter(o => { const l=getLatest(o.id); return l?.status&&l.status!=='Not Started' }).length
  const confirmed   = orgs.filter(o => getLatest(o.id)?.status?.toLowerCase().includes('confirmed')).length

  const Th = ({col,label}) => (
    <th onClick={() => handleSort(col)} className="text-left px-4 py-3 font-semibold cursor-pointer select-none whitespace-nowrap text-xs uppercase tracking-wide"
      style={{ color:'#fff9' }} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='#fff9'}>
      {label}<SortIcon col={col} sortCol={sortCol} sortDir={sortDir}/>
    </th>
  )

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          {label:'Organizations', val:orgs.filter(o=>getEffPriority(o)!=='X').length, numColor:BRAND.dark,   bg:'white'},
          {label:'Contacted',     val:contacted,   numColor:BRAND.accent, bg:'#EBF4F7'},
          {label:'Log Entries',   val:totalLogged,  numColor:'#B45309',   bg:'#FFFBEB'},
          {label:'Confirmed',     val:confirmed,    numColor:'#16A34A',   bg:'#F0FDF4'},
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center" style={{ border:`1px solid ${BRAND.subtle}`, background:s.bg }}>
            <div className="text-2xl font-bold" style={{ color:s.numColor }}>{s.val}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl px-4 py-3 mb-3 flex flex-wrap items-center gap-2" style={{ border:`1px solid ${BRAND.subtle}` }}>
        <span className="text-xs font-semibold uppercase tracking-wide mr-1" style={{ color:BRAND.accent }}>Filter</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search org name…" className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-slate-50 w-48 focus:outline-none"/>
        <select value={fP} onChange={e=>setFP(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-slate-600">
          <option value="all">All Tiers</option><option value="1">Tier 1</option><option value="2">Tier 2</option><option value="3">Tier 3</option><option value="X">Excluded (✕)</option>
        </select>
        <select value={fS} onChange={e=>setFS(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-slate-600">
          <option value="all">All Statuses</option>{STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select value={fR} onChange={e=>setFR(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-slate-600">
          <option value="all">All Responsibles</option>{team.map(m=><option key={m} value={m}>{m}</option>)}
        </select>
        {(search||fP!=='all'||fS!=='all'||fR!=='all')&&<button onClick={()=>{setSearch('');setFP('all');setFS('all');setFR('all')}} className="text-xs text-red-400 hover:text-red-600">✕ Clear</button>}
        <span className="ml-auto text-xs text-gray-400">{processed.length} of {orgs.length} orgs</span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border:`1px solid ${BRAND.subtle}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background:`linear-gradient(90deg,${BRAND.dark},${BRAND.mid})` }}>
              <Th col="name" label="Organization"/><Th col="priority" label="Tier"/><Th col="responsible" label="Responsible"/>
              <Th col="lastContact" label="Last Contact"/><Th col="status" label="Status"/><Th col="nextStep" label="Next Step"/>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wide font-semibold" style={{ color:'#fff9' }}>Log</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {processed.map((org,i) => {
              const latest=getLatest(org.id), count=getOrgEntries(org.id).length, status=latest?.status||'Not Started'
              const meta=orgMeta[org.id]||{}, ep=getEffPriority(org), isX=ep==='X'
              const rowBg=isX?'#f8f8f8':i%2===1?'#f7fbfc':'white'
              return (
                <tr key={org.id} className={`border-b transition-colors ${isX?'opacity-40':''}`} style={{ borderColor:BRAND.subtle, background:rowBg }}
                  onMouseEnter={e=>{if(!isX)e.currentTarget.style.background=BRAND.light}} onMouseLeave={e=>{e.currentTarget.style.background=rowBg}}>
                  <td className="px-4 py-3">
                    <button onClick={() => !isX&&onOrgClick(org.id)} className={`font-medium text-left transition-colors ${isX?'text-gray-400 cursor-default line-through':''}`}
                      style={isX?{}:{color:BRAND.dark}} onMouseEnter={e=>{if(!isX)e.currentTarget.style.color=BRAND.accent}} onMouseLeave={e=>{if(!isX)e.currentTarget.style.color=BRAND.dark}}>
                      {org.name}{org.custom&&<span className="ml-1 text-xs text-gray-400 font-normal">(custom)</span>}
                    </button>
                  </td>
                  <td className="px-4 py-3"><TierBadge priority={ep} onChange={t=>onUpdateMeta(org.id,{priority:t})}/></td>
                  <td className="px-4 py-3">
                    <select value={meta.responsible||''} onChange={e=>onUpdateMeta(org.id,{responsible:e.target.value})} onClick={e=>e.stopPropagation()} disabled={isX}
                      className="text-xs border border-gray-200 rounded px-1.5 py-1 bg-white text-slate-600 max-w-32 disabled:opacity-40">
                      <option value="">— Assign —</option>{team.map(m=><option key={m} value={m}>{m}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{latest?.date?fmtDate(latest.date):<span className="text-gray-300">No contact</span>}</td>
                  <td className="px-4 py-3">{!isX&&<StatusBadge status={status}/>}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-44 truncate">{latest?.nextStep||<span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 text-center">
                    {!isX&&<button onClick={()=>onOrgClick(org.id)} className="text-xs font-semibold transition-colors" style={{ color:BRAND.accent }}
                      onMouseEnter={e=>e.currentTarget.style.color=BRAND.dark} onMouseLeave={e=>e.currentTarget.style.color=BRAND.accent}>
                      {count>0?`View (${count})`:'Open'}
                    </button>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {processed.length===0&&<div className="bg-white text-center py-10 text-gray-400 text-sm">No organizations match the current filters.</div>}
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">Click any column header to sort · Click a tier badge to change tier or exclude</p>
    </div>
  )
}

// ── Org View ──────────────────────────────────────────────────────────────────

function OrgView({ org, entries, meta, team, effectivePriority, showAddEntry, setShowAddEntry, showStats, setShowStats, onBack, onAddEntry, onEditEntry, onDeleteEntry, onUpdateMeta }) {
  const latest = entries[0], isX = effectivePriority==='X'
  return (
    <div>
      <button onClick={onBack} className="text-xs flex items-center gap-1 mb-4 transition-colors" style={{ color:BRAND.accent }}
        onMouseEnter={e=>e.currentTarget.style.color=BRAND.dark} onMouseLeave={e=>e.currentTarget.style.color=BRAND.accent}>
        ← Back to Dashboard
      </button>
      <div className="bg-white rounded-xl p-5 mb-4" style={{ border:`1px solid ${BRAND.subtle}` }}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-xl font-bold" style={{ color:BRAND.dark }}>{org.name}</h2>
              <TierBadge priority={effectivePriority} onChange={t=>onUpdateMeta({priority:t})}/>
              {latest&&<StatusBadge status={latest.status}/>}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <span>Responsible:</span>
              <select value={meta.responsible||''} onChange={e=>onUpdateMeta({responsible:e.target.value})} className="text-xs border border-gray-200 rounded px-2 py-1 bg-white">
                <option value="">— Assign —</option>{team.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          {!isX&&<div className="flex gap-2">
            <button onClick={()=>setShowStats(s=>!s)} className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
              style={showStats?{background:BRAND.dark,color:'white',borderColor:BRAND.dark}:{borderColor:BRAND.subtle,color:BRAND.mid}}>📊 Stats</button>
            <button onClick={()=>setShowAddEntry(true)} className="text-xs text-white font-semibold px-3 py-1.5 rounded-lg" style={{ background:BRAND.mid }}>+ Log Communication</button>
          </div>}
        </div>
        {latest&&<div className="mt-4 pt-4 grid grid-cols-3 gap-4 text-sm" style={{ borderTop:`1px solid ${BRAND.subtle}` }}>
          <div><div className="text-xs text-gray-400 mb-0.5">Last Contact</div><div className="font-semibold" style={{ color:BRAND.dark }}>{fmtDate(latest.date)}</div></div>
          <div><div className="text-xs text-gray-400 mb-0.5">Next Step</div><div className="font-semibold truncate" style={{ color:BRAND.dark }}>{latest.nextStep||'—'}</div></div>
          <div><div className="text-xs text-gray-400 mb-0.5">Total Entries</div><div className="font-semibold" style={{ color:BRAND.dark }}>{entries.length}</div></div>
        </div>}
      </div>

      <OrgProfile org={org}/>

      {showStats&&<div className="bg-white rounded-xl p-5 mb-4" style={{ border:`1px solid ${BRAND.subtle}` }}>
        <h3 className="font-semibold mb-3 text-sm" style={{ color:BRAND.dark }}>Outreach Stats</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[{label:'Total Contacts',val:entries.length},{label:'Team Members',val:[...new Set(entries.map(e=>e.contactor))].filter(Boolean).length},{label:'Unique Statuses',val:[...new Set(entries.map(e=>e.status))].length}]
            .map(s=><div key={s.label} className="rounded-lg p-3 text-center" style={{ background:BRAND.light }}><div className="text-2xl font-bold" style={{ color:BRAND.mid }}>{s.val}</div><div className="text-xs text-gray-500 mt-0.5">{s.label}</div></div>)}
        </div>
        {entries.length>0&&<div>
          <div className="text-xs font-medium text-gray-500 mb-1">Status Progression</div>
          <div className="flex flex-wrap gap-1">{[...entries].reverse().map((e,i)=><StatusBadge key={i} status={e.status}/>)}</div>
        </div>}
      </div>}

      {showAddEntry&&<AddEntryForm orgName={org.name} team={team} onAdd={entry=>onAddEntry(entry)} onCancel={()=>setShowAddEntry(false)}/>}

      <div className="space-y-3">
        {entries.length===0&&!showAddEntry&&<div className="bg-white rounded-xl border border-dashed border-gray-300 text-center py-12 text-gray-400">
          <div className="text-3xl mb-2">📭</div>
          <div className="text-sm">No communications logged yet.</div>
          {!isX&&<button onClick={()=>setShowAddEntry(true)} className="mt-2 text-xs hover:underline" style={{ color:BRAND.accent }}>Log the first one →</button>}
        </div>}
        {entries.map(entry=><LogEntryCard key={entry.id} entry={entry} team={team} onEdit={updated=>onEditEntry(entry.id,updated)} onDelete={()=>onDeleteEntry(entry.id)}/>)}
      </div>
    </div>
  )
}

// ── Settings View ─────────────────────────────────────────────────────────────

function SettingsView({ team, onSaveTeam, entries, allOrgs, orgMeta, getLatest, getEffPriority, onBack }) {
  const [members,setMembers]     = useState([...team])
  const [newMember,setNewMember] = useState('')
  const [savedTeam,setSavedTeam] = useState(false)
  const [copied,setCopied]       = useState('')
  const [csvText,setCsvText]     = useState('')

  const toCSV = (headers, rows) =>
    [headers.join(','), ...rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(','))].join('\n')

  const copyToClipboard = async (text, label) => {
    setCsvText(text)
    try { await navigator.clipboard.writeText(text); setCopied(label); setTimeout(()=>setCopied(''),2500) }
    catch { setCopied('manual') }
  }

  const exportLog = () => {
    const headers = ['Date','Org Name','Person Contacted','Contactor','Status','Next Step','Notes']
    const rows = [...entries].sort((a,b)=>(a.date||'').localeCompare(b.date||'')).map(e => {
      const org = allOrgs.find(o=>String(o.id)===String(e.orgId))
      return [e.date, org?.name||'', e.personContacted, e.contactor, e.status, e.nextStep, e.notes]
    })
    copyToClipboard(toCSV(headers,rows),'log')
  }

  const exportSummary = () => {
    const headers = ['Org Name','Tier','Responsible','Last Contact','Current Status','Next Step']
    const rows = allOrgs.filter(o=>getEffPriority(o)!=='X').map(o => {
      const latest=getLatest(o.id), meta=orgMeta[o.id]||{}
      return [o.name,`Tier ${getEffPriority(o)}`,meta.responsible||'',latest?.date||'',latest?.status||'Not Started',latest?.nextStep||'']
    })
    copyToClipboard(toCSV(headers,rows),'summary')
  }

  const exportOutreachTracker = () => {
    const headers = ['Status','Next Step','Responsible','Date of Contact','Follow-Up Date','Outcome of Outreach','Organization Name','Priority','Address','Website / URL','Mission','Housing Work','Contact First Name','Contact Last Name','Title','Telephone','Email','Notes']
    const rows = allOrgs.filter(o=>getEffPriority(o)!=='X').map(o => {
      const latest=getLatest(o.id), meta=orgMeta[o.id]||{}, ep=getEffPriority(o)
      return [latest?.status||'Not Started',latest?.nextStep||'',meta.responsible||'',latest?.date||'','',latest?.notes||'',o.name,ep==='X'?'Excluded':`Tier ${ep}`,o.address||'',o.website||'',o.mission||'',o.housingWork||'',o.contactFirst||'',o.contactLast||'',o.title||'',o.phone||'',o.email||'','']
    })
    copyToClipboard(toCSV(headers,rows),'tracker')
  }

  return (
    <div className="max-w-lg space-y-4">
      <button onClick={onBack} className="text-xs mb-2 flex items-center gap-1" style={{ color:BRAND.accent }}>← Back</button>

      <div className="bg-white rounded-xl p-5" style={{ border:`1px solid ${BRAND.subtle}` }}>
        <h2 className="text-base font-bold mb-1" style={{ color:BRAND.dark }}>Export to Google Sheets</h2>
        <p className="text-xs text-gray-400 mb-4">Copy data to clipboard, then paste into your Google Sheet <span className="font-medium text-slate-500">(Ctrl+Shift+V)</span>.</p>
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex gap-2">
            <button onClick={exportLog} className="flex-1 text-xs py-2.5 text-white rounded-lg font-semibold hover:opacity-90" style={{ background:BRAND.mid }}>
              {copied==='log'?'✓ Copied!':'📋 Copy Communications Log'}
            </button>
            <button onClick={exportSummary} className="flex-1 text-xs py-2.5 text-white rounded-lg font-semibold hover:opacity-90" style={{ background:BRAND.accent }}>
              {copied==='summary'?'✓ Copied!':'📋 Copy Org Dashboard'}
            </button>
          </div>
          <button onClick={exportOutreachTracker} className="w-full text-xs py-2.5 text-white rounded-lg font-semibold hover:opacity-90" style={{ background:BRAND.dark }}>
            {copied==='tracker'?'✓ Copied!':'📋 Copy Outreach Tracker (original column format)'}
          </button>
        </div>
        {(copied==='manual'||csvText)&&<div className="mt-2">
          <p className="text-xs text-amber-600 mb-1">⚠ Clipboard unavailable — select all and copy manually:</p>
          <textarea readOnly value={csvText} rows={4} className="w-full text-xs font-mono border border-gray-200 rounded-lg p-2 bg-gray-50 resize-none" onClick={e=>e.target.select()}/>
        </div>}
      </div>

      <div className="bg-white rounded-xl p-5" style={{ border:`1px solid ${BRAND.subtle}` }}>
        <h2 className="text-base font-bold mb-1" style={{ color:BRAND.dark }}>Team Members</h2>
        <p className="text-xs text-gray-400 mb-4">Names available in Responsible and Contactor dropdowns.</p>
        <div className="space-y-2 mb-3">
          {members.map((m,i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={m} onChange={e=>{const u=[...members];u[i]=e.target.value;setMembers(u)}} className={inp}/>
              <button onClick={()=>setMembers(members.filter((_,j)=>j!==i))} className="text-gray-300 hover:text-red-400 text-xs px-1">✕</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <input value={newMember} onChange={e=>setNewMember(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter'&&newMember.trim()){setMembers([...members,newMember.trim()]);setNewMember('')}}}
            placeholder="Add team member…" className={inp+' flex-1'}/>
          <button onClick={()=>{if(newMember.trim()){setMembers([...members,newMember.trim()]);setNewMember('')}}} className="text-xs px-3 py-1.5 text-white rounded-lg" style={{ background:BRAND.mid }}>Add</button>
        </div>
        <button onClick={()=>{onSaveTeam(members);setSavedTeam(true);setTimeout(()=>setSavedTeam(false),2000)}} className="w-full text-sm py-2 text-white rounded-lg font-semibold" style={{ background:BRAND.dark }}>
          {savedTeam?'✓ Saved!':'Save Team'}
        </button>
      </div>
    </div>
  )
}

// ── App root ──────────────────────────────────────────────────────────────────

export default function App() {
  const [view,setView]                   = useState('home')
  const [selectedOrgId,setSelectedOrgId] = useState(null)
  const [entries,setEntries]             = useState([])
  const [orgMeta,setOrgMeta]             = useState({})
  const [customOrgs,setCustomOrgs]       = useState([])
  const [team,setTeam]                   = useState(TEAM_DEFAULT)
  const [loading,setLoading]             = useState(true)
  const [showAddEntry,setShowAddEntry]   = useState(false)
  const [showStats,setShowStats]         = useState(false)
  const [showQuickLog,setShowQuickLog]   = useState(false)
  const [showAddOrg,setShowAddOrg]       = useState(false)

  // ── Load all data on mount ─────────────────────────────────────────────
  useEffect(() => {
    async function loadAll() {
      try {
        const [e, m, c, t] = await Promise.all([
          db.loadEntries(), db.loadOrgMeta(), db.loadCustomOrgs(), db.loadTeam(),
        ])
        setEntries(e)
        setOrgMeta(m)
        setCustomOrgs(c)
        if (t.length) setTeam(t)
        else { await db.setTeam(TEAM_DEFAULT) } // seed defaults on first run
      } catch (err) {
        console.error('Load error:', err)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // ── Real-time subscriptions (live updates across all team members) ──────
  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'entries' }, ({ new:row }) => {
        const entry = mapEntry(row)
        setEntries(prev => prev.some(e => e.id===entry.id) ? prev : [...prev, entry])
      })
      .on('postgres_changes', { event:'UPDATE', schema:'public', table:'entries' }, ({ new:row }) => {
        const entry = mapEntry(row)
        setEntries(prev => prev.map(e => e.id===entry.id ? entry : e))
      })
      .on('postgres_changes', { event:'DELETE', schema:'public', table:'entries' }, ({ old:row }) => {
        setEntries(prev => prev.filter(e => e.id!==Number(row.id)))
      })
      .on('postgres_changes', { event:'*', schema:'public', table:'org_meta' }, async () => {
        setOrgMeta(await db.loadOrgMeta())
      })
      .on('postgres_changes', { event:'*', schema:'public', table:'custom_orgs' }, async () => {
        setCustomOrgs(await db.loadCustomOrgs())
      })
      .on('postgres_changes', { event:'*', schema:'public', table:'team' }, async () => {
        const t = await db.loadTeam()
        if (t.length) setTeam(t)
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  // ── Data handlers ──────────────────────────────────────────────────────
  const handleAddEntry = async (entry, orgId) => {
    const e = { ...entry, id:Date.now(), orgId, createdAt:new Date().toISOString() }
    setEntries(prev => [...prev, e])       // optimistic
    try { await db.saveEntry(e) }
    catch (err) { console.error(err); setEntries(prev => prev.filter(x => x.id!==e.id)) }
    setShowAddEntry(false); setShowQuickLog(false)
  }

  const handleEditEntry = async (id, updated) => {
    setEntries(prev => prev.map(e => e.id===id ? {...e,...updated} : e))
    const full = entries.find(e => e.id===id)
    if (full) try { await db.saveEntry({...full,...updated}) } catch (err) { console.error(err) }
  }

  const handleDeleteEntry = async (id) => {
    setEntries(prev => prev.filter(e => e.id!==id))
    try { await db.deleteEntry(id) } catch (err) { console.error(err) }
  }

  const updateOrgMeta = async (orgId, patch) => {
    const updated = { ...(orgMeta[orgId]||{}), ...patch }
    setOrgMeta(prev => ({ ...prev, [orgId]:updated }))
    try { await db.saveOrgMeta(orgId, updated) } catch (err) { console.error(err) }
  }

  const saveCustomOrgs = async (u) => {
    setCustomOrgs(u)
    try { for (const org of u) await db.saveCustomOrg(org) } catch (err) { console.error(err) }
  }

  const saveTeam = async (members) => {
    setTeam(members)
    try { await db.setTeam(members) } catch (err) { console.error(err) }
  }

  const handleAddOrg = async (fields) => {
    const { priority, ...rest } = fields
    const newOrg = { id:Date.now(), ...rest, priority:+priority, custom:true }
    await saveCustomOrgs([...customOrgs, newOrg])
    setShowAddOrg(false)
  }

  const allOrgs        = [...INITIAL_ORGS, ...customOrgs]
  const getEffPriority = org => orgMeta[org.id]?.priority ?? org.priority
  const getOrgEntries  = id  => entries.filter(e => String(e.orgId)===String(id)).sort((a,b) => b.date<a.date?-1:1).reverse()
  const getLatest      = id  => { const e=getOrgEntries(id); return e.length?e[0]:null }
  const selectedOrg    = allOrgs.find(o => o.id===selectedOrgId)

  const navHome = () => { setView('home'); setSelectedOrgId(null); setShowAddEntry(false); setShowStats(false) }
  const navOrg  = id  => { setSelectedOrgId(id); setView('org'); setShowAddEntry(false); setShowStats(false) }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:BRAND.light }}>
      <div className="text-center">
        <div className="text-3xl mb-3">📋</div>
        <div className="text-sm font-medium" style={{ color:BRAND.mid }}>Loading Communications Log…</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen font-sans text-slate-800" style={{ background:BRAND.light }}>
      {/* Header */}
      <header className="sticky top-0 z-10 px-5 py-0 flex items-stretch justify-between"
        style={{ background:`linear-gradient(135deg,${BRAND.dark} 0%,${BRAND.mid} 60%,${BRAND.accent} 100%)` }}>
        <button onClick={navHome} className="flex items-center gap-3 py-3 group">
          <div className="flex flex-col leading-none select-none">
            <span className="text-white font-black text-sm tracking-widest uppercase">Farnam</span>
            <span className="text-white/70 font-light text-xs tracking-[0.2em] uppercase">Associates</span>
          </div>
          <div className="w-px self-stretch bg-white/20 mx-1"/>
          <span className="text-white/80 text-xs font-medium tracking-wide group-hover:text-white transition-colors">Communications Log</span>
          {view==='org'&&selectedOrg&&<><span className="text-white/30 text-xs">/</span><span className="text-white/80 text-xs truncate max-w-xs">{selectedOrg.name}</span></>}
          {view==='settings'&&<><span className="text-white/30 text-xs">/</span><span className="text-white/80 text-xs">Settings</span></>}
        </button>
        <div className="flex items-center gap-2">
          {view==='home'&&<>
            <button onClick={()=>setShowAddOrg(true)} className="text-xs text-white/80 border border-white/30 px-3 py-1.5 rounded-lg hover:bg-white/10 font-medium">+ Add Org</button>
            <button onClick={()=>setShowQuickLog(true)} className="text-xs text-white font-semibold px-3 py-1.5 rounded-lg" style={{ background:BRAND.accent }}>+ Log Communication</button>
          </>}
          <button onClick={()=>setView('settings')} className="text-xs text-white/50 hover:text-white/90 px-2 py-1 rounded hover:bg-white/10 ml-1">⚙</button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="px-5 py-1.5 text-xs flex items-center gap-1.5" style={{ background:BRAND.dark+'22', borderBottom:`1px solid ${BRAND.subtle}` }}>
        <button onClick={navHome} className="font-semibold hover:underline" style={{ color:BRAND.mid }}>Dashboard</button>
        {view==='org'&&selectedOrg&&<><span className="text-gray-400">/</span><span className="text-gray-500">{selectedOrg.name}</span></>}
        {view==='settings'&&<><span className="text-gray-400">/</span><span className="text-gray-500">Settings</span></>}
      </div>

      <main className="max-w-7xl mx-auto px-4 py-5">
        {view==='home'&&<HomeView orgs={allOrgs} orgMeta={orgMeta} team={team} getEffPriority={getEffPriority} getLatest={getLatest} getOrgEntries={getOrgEntries} onOrgClick={navOrg} onUpdateMeta={updateOrgMeta}/>}
        {view==='org'&&selectedOrg&&<OrgView org={selectedOrg} entries={getOrgEntries(selectedOrg.id)} meta={orgMeta[selectedOrg.id]||{}} team={team} effectivePriority={getEffPriority(selectedOrg)} showAddEntry={showAddEntry} setShowAddEntry={setShowAddEntry} showStats={showStats} setShowStats={setShowStats} onBack={navHome} onAddEntry={entry=>handleAddEntry(entry,selectedOrg.id)} onEditEntry={handleEditEntry} onDeleteEntry={handleDeleteEntry} onUpdateMeta={patch=>updateOrgMeta(selectedOrg.id,patch)}/>}
        {view==='settings'&&<SettingsView team={team} onSaveTeam={saveTeam} entries={entries} allOrgs={allOrgs} orgMeta={orgMeta} getLatest={getLatest} getEffPriority={getEffPriority} onBack={navHome}/>}
      </main>

      {showQuickLog&&<Modal onClose={()=>setShowQuickLog(false)}><AddEntryForm orgs={allOrgs.filter(o=>getEffPriority(o)!=='X')} team={team} showOrgSelector onAdd={(e,id)=>handleAddEntry(e,id)} onCancel={()=>setShowQuickLog(false)}/></Modal>}
      {showAddOrg&&<Modal onClose={()=>setShowAddOrg(false)}><AddOrgForm onAdd={handleAddOrg} onCancel={()=>setShowAddOrg(false)}/></Modal>}
    </div>
  )
}
