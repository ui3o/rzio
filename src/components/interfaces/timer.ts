export interface Timer {
    started: boolean,
    curTime: number,
    curPos: number,
    workoutTimeMap: Array<number>,
    workoutTimeRawMap: Array<string>,
    workoutIsActiveMap: Array<boolean>,
}
