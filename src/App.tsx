import './App.css'
import TimeLine from './components/ui/TimeLine'
import { Workout } from './components/interfaces/workout'
import Gong from './components/ui/Gong'
import { Timer } from './components/interfaces/timer'
import React from 'react'

let keyboardEventTimestamp = 0;
let WORKOUT_KEY = "WORKOUT";
let DEMO_WORKOUT = `Demo1	0.10	0.05	12		13
Demo2.1	1.10	0.05	12	8	13	8
Demo2.2			12	12	13	12
Demo3	0.10	0.05	12		13`;

interface Props {
}

interface State {
    timer: Timer;
    workout: Array<Array<Workout>>;
}

const initialState: State = {
    timer: {
        started: false, curPos: 0, curTime: 0,
        workoutIsActiveMap: [],
        workoutTimeMap: [],
        workoutTimeRawMap: []

    },
    workout: []
};

export default class App extends React.Component<Props, State> {


    constructor(props: Props) {
        super(props);
        this.state = initialState;
        console.log("App constructor")
        const keyListener = (event: KeyboardEvent) => {

            // maradhat igy, mindketton click a nex vagy start, dupla a restart, a long click load from clipboard, az enter start vagy next, backspace nem kell
            if (event.key === "Enter" && (event.timeStamp | 0) !== keyboardEventTimestamp) {
                this.startWorkoutOrNext();
            }
            else if (event.key === "Escape" && (event.timeStamp | 0) !== keyboardEventTimestamp) {
                keyboardEventTimestamp = event.timeStamp | 0;
                this.restartWorkout();
            }
            if (event.key === "v" && (event.timeStamp | 0) !== keyboardEventTimestamp) {
                keyboardEventTimestamp = event.timeStamp | 0;
                this.loadWorkoutFromClipboard();
            } else
                event.preventDefault()
        }

        if ((window as any)["MainTimer"])
            clearInterval((window as any)["MainTimer"]);
        (window as any)["MainTimer"] = setInterval(() => {
            if (this.state.timer.started) {
                let curTime = this.state.timer.curTime + 1;
                let curPos = this.state.timer.curPos;
                const workoutIsActiveMap = this.state.timer.workoutIsActiveMap;

                console.log("timer run", curPos, this.state.timer.workoutTimeMap[curPos], curTime)

                if (this.state.timer.workoutTimeMap[curPos] <= curTime) {
                    workoutIsActiveMap[curPos] = false;
                    curTime = 0;
                    console.log("time reached");
                    curPos++;
                    (document.getElementsByClassName("my_audio")[0] as any).play();
                }

                this.setState({
                    timer: {
                        started: true,
                        curPos: curPos,
                        curTime: curTime,
                        workoutIsActiveMap: workoutIsActiveMap,
                        workoutTimeMap: this.state.timer.workoutTimeMap,
                        workoutTimeRawMap: this.state.timer.workoutTimeRawMap,
                    }, workout: this.state.workout
                })
            }

        }, 1000)
        document.getElementsByTagName("body")[0].addEventListener('keyup', keyListener);
        setTimeout(() => {
            const localWorkout = localStorage.getItem(WORKOUT_KEY);
            const wo = localWorkout ? localWorkout : DEMO_WORKOUT;
            this.loadWorkout(wo);
            setTimeout(() => {
                this.startWorkout();
            });

        }, 1000);
    }

    restartWorkout() {
        this.setState({
            timer: {
                started: false,
                curPos: 0,
                curTime: 0,
                workoutIsActiveMap: new Array(this.state.timer.workoutTimeMap.length).fill(true),
                workoutTimeMap: this.state.timer.workoutTimeMap,
                workoutTimeRawMap: this.state.timer.workoutTimeRawMap,
            }, workout: this.state.workout
        })
        console.log("set stop", this.state.timer.started)

    }

    startWorkout() {
        this.setState({
            timer: {
                started: true,
                curPos: this.state.timer.curPos,
                curTime: this.state.timer.curTime,
                workoutIsActiveMap: new Array(this.state.timer.workoutTimeMap.length).fill(true),
                workoutTimeMap: this.state.timer.workoutTimeMap,
                workoutTimeRawMap: this.state.timer.workoutTimeRawMap,
            }, workout: this.state.workout
        })
        console.log("set start", this.state.timer.started)

    }

    startWorkoutOrNext() {
        (document.getElementsByClassName("my_audio")[0] as any).play();
        if (!this.state.timer.started)
            this.startWorkout();
        else {
            const curPos = this.state.timer.curPos + 1;
            const workoutIsActiveMap = this.state.timer.workoutIsActiveMap;

            console.log("call next run", curPos, this.state.timer.workoutTimeMap[curPos])
            workoutIsActiveMap[this.state.timer.curPos] = false;

            this.setState({
                timer: {
                    started: true,
                    curPos: curPos,
                    curTime: 0,
                    workoutIsActiveMap: workoutIsActiveMap,
                    workoutTimeMap: this.state.timer.workoutTimeMap,
                    workoutTimeRawMap: this.state.timer.workoutTimeRawMap,
                }, workout: this.state.workout
            })
        }
    }

    loadWorkoutFromClipboard() {
        navigator.clipboard
            .readText()
            .then((clipText) => {
                const wo = clipText.includes('\n') ? clipText : DEMO_WORKOUT;
                localStorage.setItem(WORKOUT_KEY, wo);
                this.loadWorkout(wo);
            });
    }

    loadWorkout(clipText: string) {
        const workout: Array<Array<Workout>> = []
        clipText.split("\n").forEach(l => {
            const r = l.split('\t')
            for (let index = 0, i = 3; index < (r.length - 3) / 2; index++, i += 2) {
                workout[index] = workout[index] === undefined ? [] : workout[index];
                if (!r[1]) {
                    let w = workout[index].pop();
                    w!.ex.push({ name: r[0], count: r[i], weight: r[i + 1] });
                    workout[index].push(w!);
                }
                else
                    workout[index].push({ dur: r[1], rest: r[2], ex: [{ name: r[0], count: r[i], weight: r[i + 1] }] });
            }
            console.log(r.length)
        });
        console.log(clipText)
        const workoutTimeMap = workout.flatMap((w) => {
            return w.flatMap(r => {
                return [r.dur, r.rest]
            })
        }).map((t) => {
            const timeArray = t.split(".")
            return Number(timeArray[0]) * 60 + Number(timeArray[1]);
        })
        const workoutTimeRawMap = workout.flatMap((w) => {
            return w.flatMap(r => {
                return [r.dur, r.rest]
            })
        });
        this.setState({
            workout: workout, timer: {
                started: this.state.timer.started,
                curPos: this.state.timer.curPos,
                curTime: this.state.timer.curTime,
                workoutIsActiveMap: this.state.timer.workoutIsActiveMap,
                workoutTimeMap: workoutTimeMap,
                workoutTimeRawMap: workoutTimeRawMap,
            }
        })

    }

    changeStateClick(type: "single" | "double") {
        if (type === "single") {
            this.startWorkoutOrNext();
            console.log("=== single click")
        } else {
            this.restartWorkout();
            console.log("=== double click")
        }
    }

    public render(): JSX.Element {
        return (
            <>
                <TimeLine changeStateClick={this.changeStateClick.bind(this)} onClick={this.loadWorkoutFromClipboard.bind(this)} timer={this.state.timer} workout={this.state.workout}></TimeLine>
                <Gong />
            </>
        )
    }
}

