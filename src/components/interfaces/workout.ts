export interface Workout {
    dur: string,
    rest: string,
    ex: Array<{
        name: string
        count: string
        weight: string
    }>
}
