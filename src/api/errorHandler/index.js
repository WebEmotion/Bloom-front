const errorCatalog = {
    0: 'Servicio no disponible', 
    1: 'Información faltante o tipos inválidos',
    2: 'Credenciales de Facebook inválidas',
    3: 'Credenciales de Google inválidas',
    4: 'Tus credenciales son inválidas',
    5: 'Token de autorización inválido',
    6: 'Tu correo ya se encuentra registrado',
    7: 'Evento no encontrado',
    8: 'No posees los permisos para acceder a este recurso',
    9: 'Compra no encontrada',
    14: 'No se pudo actualizar el cliente: el correo ya existe',
    19: 'Hubo un error al procesar el pago con PayPal',
    500: 'Hubo un error al procesar la información',
    16: 'No quedan asientos disponibles'
}

const handleError = (code, message) => {
    return {
        success: false,
        message: message
    }
}

export default handleError