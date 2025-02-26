import React from "react";
import { Workout } from "../interfaces/workout";
import { Timer } from "../interfaces/timer";

interface Props {
    allRound?: number
    round?: number
    workout: Array<Workout>
    timer: Timer;

}

interface State {
    clicks: number;
}

const initialState: State = {
    clicks: 0
};

export default class Card extends React.Component<Props, State> {

    private exerciseCounter = 0;
    private currentActiveItem: number = -1;

    constructor(props: Props) {
        super(props);
        this.state = initialState;
    }

    createExerciseList(wo: Workout): JSX.Element {
        const ex: Array<JSX.Element> = []
        for (const w of wo.ex) {
            ex.push(
                (<>
                    <li className="py-3 sm:py-4">
                        <div className="flex items-baseline justify-between ">
                            <div className="align-baseline leading-none mr-2 font-bold">
                                {w.name}
                            </div>
                            <div className="flex">
                                <div className=" w-16 text-center select-none whitespace-nowrap rounded-lg bg-black py-2 px-3.5 align-baseline font-sans  font-bold uppercase leading-none text-white ">
                                    <span className="">{w.count}</span>
                                </div>
                                {w.weight &&
                                    <>
                                        <div className=" select-none whitespace-nowrap  py-2 px-3.5 align-baseline font-sans  font-bold uppercase leading-none">
                                            <div className="">x</div>
                                        </div>
                                        <div className="w-16 text-center select-none whitespace-nowrap rounded-lg bg-blue-900 py-2 px-3.5 align-baseline font-sans  font-bold uppercase leading-none text-white">
                                            <span className="">{w.weight}</span>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </li>
                </>)
            );
        }
        return (<>{ex}</>)
    }


    calculateTimer(index: number, dur: string): string {
        const zeroPad = (num: string, places: number) => num.padStart(places, '0');
        dur = dur.replace(".", ":");
        const digits = dur.split(":");
        dur = `${zeroPad(digits[0], 2)}:${zeroPad(digits[1], 2)}`;
        const curTime = `${zeroPad((this.props.timer.curTime / 60).toString().split(".")[0], 2)}:${zeroPad(String(this.props.timer.curTime % 60), 2)}`
        return this.currentActiveItem === index ? `${curTime} / ${dur}` : dur;
    }

    calculateGoReadyState(durNumber: number): boolean {
        const currentActiveItem = durNumber - 1 < 0 ? 0 : durNumber - 1;
        return (!this.props.timer?.workoutIsActiveMap[currentActiveItem - 1] && this.props.timer?.workoutIsActiveMap[currentActiveItem]) ||
            this.currentActiveItem === durNumber ? true : false;
    }

    createWorkOutList(): JSX.Element {
        if (this.props.workout) {
            const workoutList: Array<JSX.Element> = []
            for (let index = 0; index < this.props.workout.length; index++) {
                const durState = this.props.timer.workoutIsActiveMap[this.exerciseCounter];
                const durNumber = this.exerciseCounter;
                this.exerciseCounter++
                const restState = this.props.timer?.workoutIsActiveMap[this.exerciseCounter];
                const restNUmber = this.exerciseCounter;
                this.exerciseCounter++
                workoutList.push(
                    (<>
                        {restState &&
                            <li className={`py-3 sm:py-4  ${this.calculateGoReadyState(durNumber) ? "bg-lime-200" : "bg-amber-50"} ${this.currentActiveItem === restNUmber ? "bg-gray-100" : "bg-amber-50"}`}>
                                <div className=" font-normal">
                                    {durState &&
                                        <ul role="list" className="ml-9 text-3xl">
                                            {this.createExerciseList(this.props.workout[index])}
                                        </ul>
                                    }
                                    <div className="flex justify-between text-4xl">
                                        {durState &&
                                            <div className={`center min-w-9/12 select-none whitespace-nowrap rounded-lg py-2 px-3.5 align-baseline font-sans  font-bold uppercase leading-none text-white ${this.currentActiveItem === durNumber ? "bg-red-500" : "bg-orange-300"}`}>
                                                <div className="mt-px">{this.calculateTimer(durNumber, this.props.workout[index].dur)}</div>
                                            </div>
                                        }
                                        {restState &&
                                            <div className={`center min-w-2/12 select-none whitespace-nowrap rounded-lg py-2 px-3.5 align-baseline font-sans  font-bold uppercase leading-none text-white ${this.currentActiveItem === restNUmber ? "bg-green-700" : "bg-green-500"}`}>
                                                <div className="mt-px">{this.calculateTimer(restNUmber, this.props.workout[index].rest)}</div>
                                            </div>
                                        }
                                    </div>

                                </div>
                            </li>
                        }
                    </>)
                )
            }
            return (
                <>
                    {workoutList}
                </>
            )
        }
        return (<></>);
    }


    public render(): JSX.Element {
        this.exerciseCounter = Number(this.props.round) * Number(this.props.workout?.length) * 2;
        let exerciseCounter = Number(this.props.round) * Number(this.props.workout?.length) * 2;
        this.currentActiveItem = -1;
        for (let index = 0; index < this.props.workout.length * 2; index++) {
            if (!this.props.timer?.workoutIsActiveMap[exerciseCounter - 1] && this.props.timer?.workoutIsActiveMap[exerciseCounter] && this.currentActiveItem === -1) {
                this.currentActiveItem = exerciseCounter;
            }
            exerciseCounter++;
        }

        const round = this.props.round !== undefined ? this.props.round + 1 : 0
        return (
            <>
                <div className="w-[calc(100%)] bg-white p-4 rounded border border-slate-200 shadow" >
                    <div className=" items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-900 text-5xl">{round}
                            <span className="font-normal text-3xl">/{this.props.allRound}</span>
                            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                                {this.createWorkOutList()}
                            </ul>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
