export type UsuarioForAuth = {
  id: string
  rol: 'ADMINISTRADOR' | 'SUPERVISOR'
  correoElectronico: string
  contrasena: string
  activo: boolean
}
