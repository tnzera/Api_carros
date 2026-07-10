import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { api } from '../api/client';
import type { Cliente, Paginated } from '../api/types';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';

const emptyForm = { nome: '', cpf: '', cnh: '', email: '', telefone: '', senha: '', role: 'cliente' };

export function ClientesPage() {
  const [result, setResult] = useState<Paginated<Cliente> | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setResult(await api.get<Paginated<Cliente>>(`/clientes?page=${page}&limit=10`));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  function set(field: keyof typeof emptyForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(cliente: Cliente) {
    setEditing(cliente);
    setForm({
      nome: cliente.nome,
      cpf: cliente.cpf,
      cnh: cliente.cnh,
      email: cliente.email,
      telefone: cliente.telefone,
      senha: '',
      role: cliente.role,
    });
    setFormError('');
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      if (editing) {
        // Na edição a senha não é alterada por aqui
        const { senha: _senha, ...dados } = form;
        await api.patch(`/clientes/${editing.id}`, dados);
      } else {
        await api.post('/clientes', form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cliente: Cliente) {
    if (!confirm(`Remover o cliente ${cliente.nome}?`)) return;
    try {
      await api.delete(`/clientes/${cliente.id}`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover');
    }
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Clientes</h1>
          <p>Gerencie a base de clientes cadastrados.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          + Novo Cliente
        </button>
      </header>

      {error && <div className="alert-error">{error}</div>}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th className="th-actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {result?.data.map((cliente) => (
              <tr key={cliente.id}>
                <td>
                  <span className="avatar">{cliente.nome.charAt(0).toUpperCase()}</span>
                  <strong>{cliente.nome}</strong>{' '}
                  {cliente.role === 'admin' && <span className="badge badge-admin">Admin</span>}
                </td>
                <td>{cliente.email}</td>
                <td>{cliente.cpf}</td>
                <td>{cliente.telefone}</td>
                <td className="td-actions">
                  <button className="btn-icon" onClick={() => openEdit(cliente)} title="Editar">
                    ✏️
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleDelete(cliente)}
                    title="Remover"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {result?.data.length === 0 && (
              <tr>
                <td colSpan={5} className="empty">
                  Nenhum cliente cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {result && (
          <Pagination
            page={result.page}
            lastPage={result.lastPage}
            total={result.total}
            onChange={setPage}
          />
        )}
      </div>

      <Modal
        title={editing ? 'Editar Cliente' : 'Novo Cliente'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="form">
          {formError && <div className="alert-error">{formError}</div>}

          <label>
            Nome
            <input value={form.nome} onChange={(e) => set('nome', e.target.value)} required />
          </label>

          <div className="form-row">
            <label>
              CPF (11 dígitos)
              <input
                value={form.cpf}
                onChange={(e) => set('cpf', e.target.value)}
                maxLength={11}
                required
              />
            </label>
            <label>
              CNH (11 dígitos)
              <input
                value={form.cnh}
                onChange={(e) => set('cnh', e.target.value)}
                maxLength={11}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              E-mail
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                required
              />
            </label>
            <label>
              Telefone
              <input
                value={form.telefone}
                onChange={(e) => set('telefone', e.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Tipo
              <select value={form.role} onChange={(e) => set('role', e.target.value)}>
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </label>
            {!editing && (
              <label>
                Senha (mín. 6 caracteres)
                <input
                  type="password"
                  value={form.senha}
                  onChange={(e) => set('senha', e.target.value)}
                  minLength={6}
                  required
                />
              </label>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
