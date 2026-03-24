import { useState } from "react";
import { Users, Plus, Edit2, ToggleLeft, ToggleRight, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockTeam, roles, allPermissions, rolePermissions, type TeamMember, type Role, type Permission } from "@/data/adminTeamData";

const AdminTeam = () => {
  const [team, setTeam] = useState<TeamMember[]>(mockTeam);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<Role>("Atendimento");
  const [formPermissions, setFormPermissions] = useState<Permission[]>([]);

  const openCreate = () => {
    setEditing(null);
    setFormName(""); setFormEmail(""); setFormRole("Atendimento");
    setFormPermissions([...rolePermissions.Atendimento]);
    setShowModal(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setFormName(m.name); setFormEmail(m.email); setFormRole(m.role);
    setFormPermissions([...m.permissions]);
    setShowModal(true);
  };

  const handleRoleChange = (r: Role) => {
    setFormRole(r);
    setFormPermissions([...rolePermissions[r]]);
  };

  const togglePerm = (p: Permission) => {
    setFormPermissions(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleSave = () => {
    if (!formName || !formEmail) return;
    if (editing) {
      setTeam(prev => prev.map(m => m.id === editing.id ? { ...m, name: formName, email: formEmail, role: formRole, permissions: formPermissions } : m));
    } else {
      const newMember: TeamMember = {
        id: `team-${Date.now()}`, name: formName, email: formEmail, role: formRole,
        permissions: formPermissions, active: true, lastLogin: "—", createdAt: new Date().toLocaleDateString("pt-BR"),
      };
      setTeam(prev => [...prev, newMember]);
    }
    setShowModal(false);
  };

  const toggleActive = (id: string) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pt-12 md:pt-6 space-y-6 max-w-[1400px] w-full overflow-hidden mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[hsl(var(--dark-section-fg))]">Equipe</h1>
          <p className="text-sm text-[hsl(var(--dark-section-muted))] mt-1">Gerencie os acessos do sistema</p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold text-sm">
          <Plus className="w-4 h-4 mr-2" /> Novo Usuário
        </Button>
      </div>

      <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--dark-section-border))]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Usuário</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Perfil</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider hidden lg:table-cell">Último acesso</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-[hsl(var(--dark-section-muted))] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {team.map((m) => (
                <tr key={m.id} className="border-b border-[hsl(var(--dark-section-border))]/50 hover:bg-[hsl(var(--dark-section))]/30 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-[hsl(var(--dark-section-fg))]">{m.name}</p>
                    <p className="text-xs text-[hsl(var(--dark-section-muted))] md:hidden">{m.email}</p>
                  </td>
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-muted))] hidden md:table-cell">{m.email}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      <Shield className="w-3 h-3" /> {m.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[hsl(var(--dark-section-muted))] text-xs hidden lg:table-cell">{m.lastLogin}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => toggleActive(m.id)} className="inline-flex items-center gap-1">
                      {m.active ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6 text-[hsl(var(--dark-section-muted))]" />}
                      <span className={`text-xs font-semibold ${m.active ? "text-emerald-400" : "text-[hsl(var(--dark-section-muted))]"}`}>{m.active ? "Ativo" : "Inativo"}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(m)} className="text-primary hover:bg-primary/10 rounded-lg text-xs">
                      <Edit2 className="w-3 h-3 mr-1" /> Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[hsl(var(--dark-section-card))] border border-[hsl(var(--dark-section-border))] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-bold text-[hsl(var(--dark-section-fg))]">{editing ? "Editar Usuário" : "Novo Usuário"}</h3>
              <button onClick={() => setShowModal(false)} className="text-[hsl(var(--dark-section-muted))] hover:text-[hsl(var(--dark-section-fg))]"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-[hsl(var(--dark-section-muted))] font-semibold uppercase tracking-wider">Nome</label>
                <Input value={formName} onChange={e => setFormName(e.target.value)} className="bg-[hsl(var(--dark-section))]/50 border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] rounded-xl mt-1" />
              </div>
              <div>
                <label className="text-xs text-[hsl(var(--dark-section-muted))] font-semibold uppercase tracking-wider">Email</label>
                <Input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} className="bg-[hsl(var(--dark-section))]/50 border-[hsl(var(--dark-section-border))] text-[hsl(var(--dark-section-fg))] rounded-xl mt-1" />
              </div>
              <div>
                <label className="text-xs text-[hsl(var(--dark-section-muted))] font-semibold uppercase tracking-wider">Perfil de acesso</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {roles.map(r => (
                    <button key={r} onClick={() => handleRoleChange(r)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${formRole === r ? "bg-primary text-primary-foreground border-primary" : "bg-[hsl(var(--dark-section))]/50 text-[hsl(var(--dark-section-muted))] border-[hsl(var(--dark-section-border))]"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-[hsl(var(--dark-section-muted))] font-semibold uppercase tracking-wider">Permissões</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {allPermissions.map(p => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer bg-[hsl(var(--dark-section))]/50 rounded-xl px-3 py-2 border border-[hsl(var(--dark-section-border))]">
                      <input type="checkbox" checked={formPermissions.includes(p.id)} onChange={() => togglePerm(p.id)}
                        className="rounded border-[hsl(var(--dark-section-border))] accent-primary" />
                      <span className="text-xs text-[hsl(var(--dark-section-fg))]">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold">
                {editing ? "Salvar Alterações" : "Criar Usuário"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeam;
