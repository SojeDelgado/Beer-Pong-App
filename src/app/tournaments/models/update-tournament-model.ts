export interface UpdateTournamentDto {
  name?: string;
  place?: string;
  createdAt?: Date;
  finishedAt?: Date;
  status?: TournamentStatus;
  winner?: string;
}

export enum TournamentStatus {
    PENDIENTE = 'Pendiente',
    COMPLETADO = 'Completado',
    FINALIZADO = 'Finalizado'
}