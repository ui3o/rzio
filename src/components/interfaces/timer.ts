export interface Timer {
    started: boolean,
    curTime: number,
    curPos: number,
    workoutTimeMap: Array<number>,
    workoutIsActiveMap: Array<boolean>,
}
