export interface UpdateTournamentMatch {
    homeId: string,
    awayId: string,
    
    homeScore: number,
    awayScore: number,
    homeIsla: boolean,
    awayIsla: boolean,
    home2in1: boolean,
    away2in1: boolean,
    home3in1: boolean,
    away3in1: boolean,

    matchId: number,
    nextMatchId?: number
}