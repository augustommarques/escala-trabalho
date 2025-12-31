export const users = {
  data: [
    { id: 1, name: 'Admin Escala', email: 'admin@escala.test', role: 'administrador', role_label: 'Administrador', jornada: '08:30-17:30', initials: 'AE', created_at: '01/09/2026 10:00' },
    { id: 2, name: 'Francielle', email: 'francielle@escala.test', role: 'usuario', role_label: 'Usuário', jornada: '08:30-17:30', initials: 'FR', created_at: '02/09/2026 09:15' },
    { id: 3, name: 'Leny', email: 'leny@escala.test', role: 'usuario', role_label: 'Usuário', jornada: '08:30-17:30', initials: 'LE', created_at: '02/09/2026 09:20' },
    { id: 4, name: 'Paula', email: 'paula@escala.test', role: 'usuario', role_label: 'Usuário', jornada: '09:00-18:00', initials: 'PA', created_at: '02/09/2026 09:25' },
    { id: 5, name: 'Diego', email: 'diego@escala.test', role: 'usuario', role_label: 'Usuário', jornada: '09:00-18:00', initials: 'DI', created_at: '03/09/2026 11:00' },
  ],
  from: 1,
  to: 5,
  total: 5,
};

export const roles = [
  { value: 'administrador', label: 'Administrador' },
  { value: 'usuario', label: 'Usuário' },
];
