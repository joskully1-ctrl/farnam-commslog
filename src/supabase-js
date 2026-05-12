import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Field mappers (snake_case DB ↔ camelCase app) ──────────────────────────

export const mapEntry = row => ({
  id:              Number(row.id),
  orgId:           row.org_id,
  date:            row.date || '',
  personContacted: row.person_contacted || '',
  contactor:       row.contactor || '',
  notes:           row.notes || '',
  status:          row.status || 'Not Started',
  nextStep:        row.next_step || '',
  createdAt:       row.created_at || '',
})

const entryToRow = e => ({
  id:               Number(e.id),
  org_id:           String(e.orgId),
  date:             e.date || null,
  person_contacted: e.personContacted || null,
  contactor:        e.contactor || null,
  notes:            e.notes || null,
  status:           e.status || 'Not Started',
  next_step:        e.nextStep || null,
  created_at:       e.createdAt || new Date().toISOString(),
})

export const mapCustomOrg = row => ({
  id:           Number(row.id),
  name:         row.name,
  priority:     row.priority,
  address:      row.address || '',
  website:      row.website || '',
  mission:      row.mission || '',
  housingWork:  row.housing_work || '',
  contactFirst: row.contact_first || '',
  contactLast:  row.contact_last || '',
  title:        row.title || '',
  phone:        row.phone || '',
  email:        row.email || '',
  custom:       true,
})

const customOrgToRow = o => ({
  id:            Number(o.id),
  name:          o.name,
  priority:      Number(o.priority) || 1,
  address:       o.address || null,
  website:       o.website || null,
  mission:       o.mission || null,
  housing_work:  o.housingWork || null,
  contact_first: o.contactFirst || null,
  contact_last:  o.contactLast || null,
  title:         o.title || null,
  phone:         o.phone || null,
  email:         o.email || null,
  custom:        true,
})

// ── Database API ─────────────────────────────────────────────────────────────

export const db = {
  // Entries
  async loadEntries() {
    const { data, error } = await supabase
      .from('entries').select('*').order('date', { ascending: true })
    if (error) throw error
    return (data || []).map(mapEntry)
  },
  async saveEntry(entry) {
    const { error } = await supabase.from('entries').upsert(entryToRow(entry))
    if (error) throw error
  },
  async deleteEntry(id) {
    const { error } = await supabase.from('entries').delete().eq('id', Number(id))
    if (error) throw error
  },

  // Org Meta
  async loadOrgMeta() {
    const { data, error } = await supabase.from('org_meta').select('*')
    if (error) throw error
    return (data || []).reduce((acc, row) => {
      if (!row.org_id) return acc
      acc[row.org_id] = {}
      if (row.responsible) acc[row.org_id].responsible = row.responsible
      if (row.priority != null)
        acc[row.org_id].priority = isNaN(row.priority) ? row.priority : Number(row.priority)
      return acc
    }, {})
  },
  async saveOrgMeta(orgId, meta) {
    const { error } = await supabase.from('org_meta').upsert({
      org_id:      String(orgId),
      responsible: meta.responsible || null,
      priority:    meta.priority != null ? String(meta.priority) : null,
    })
    if (error) throw error
  },

  // Custom Orgs
  async loadCustomOrgs() {
    const { data, error } = await supabase
      .from('custom_orgs').select('*').order('id')
    if (error) throw error
    return (data || []).map(mapCustomOrg)
  },
  async saveCustomOrg(org) {
    const { error } = await supabase.from('custom_orgs').upsert(customOrgToRow(org))
    if (error) throw error
  },

  // Team
  async loadTeam() {
    const { data, error } = await supabase
      .from('team').select('name').order('id')
    if (error) throw error
    return (data || []).map(r => r.name)
  },
  async setTeam(members) {
    await supabase.from('team').delete().neq('id', 0)
    if (members.length) {
      const { error } = await supabase
        .from('team').insert(members.map(name => ({ name })))
      if (error) throw error
    }
  },
}
