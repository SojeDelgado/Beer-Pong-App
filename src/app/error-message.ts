import { HttpErrorResponse } from "@angular/common/http";

export function setErrorMessage(err: HttpErrorResponse, dataName?: string): string {
    let errorMessage = '';
    let name = dataName ?? '';
    if (err) {
        if (err.error instanceof ErrorEvent) {
            errorMessage = `Un error ha ocurrido: ${err.error.message}`;
        } else {
            const status = err.status;
            if (status === 401) errorMessage = `No estás autorizado para acceder a ${name}.`;
            if (status === 404) errorMessage = `Los ${name} no se han encontrado. Intente más tarde.`;
            if (status > 500 && status < 600) errorMessage = `El servidor no está funcionando. Intente más tarde.`;
            if (status === 0) errorMessage = `No se pudo establecer una conexión con el servidor debido a una red inestable, desconexión o falta de conexión`
        }
    }
    return errorMessage;
}