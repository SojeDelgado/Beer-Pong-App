export interface UpdateTournament {
  name?: string;
  place?: string;
  finishedAt?: Date;
  status?: TournamentStatus;
  winner?: string;
}

export enum TournamentStatus {
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado',
  FINALIZADO = 'Finalizado'
}