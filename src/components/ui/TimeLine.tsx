import React from "react";
import { Workout } from "../interfaces/workout";
import TimeLineItem from "./TimeLineItem";
import { Timer } from "../interfaces/timer";
import ClipboardLoader from "./ClipboardLoader";

interface Props {
  onClick: () => void
  changeStateClick: (type: "single" | "double") => void
  workout?: Array<Array<Workout>>
  timer: Timer;

}

interface State {
  clicks: number;
}

const initialState: State = {
  clicks: 0
};

export default class TimeLine extends React.Component<Props, State> {

  private clickWaitTimer: Array<number | undefined> = [];

  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  componentDidUpdate(_prevProps: Props, _prevState: State): void {
  }

  createTimeLine(): JSX.Element {
    if (this.props.workout) {
      const timeLineList: Array<JSX.Element> = []
      for (let index = 0; index < this.props.workout.length; index++) {
        timeLineList.push((<TimeLineItem timer={this.props.timer} round={index} workout={this.props.workout[index]} allRound={this.props.workout.length}></TimeLineItem>))
      }
      return (
        <>
          {timeLineList}
        </>
      )
    }
    return (<></>);
  }


  calculateActualTimer(): number {
    let currentActiveItem = -1;
    for (let index = 0; index < this.props.timer.workoutTimeMap.length; index++) {
      if (!this.props.timer?.workoutIsActiveMap[index - 1] && this.props.timer?.workoutIsActiveMap[index] && currentActiveItem === -1) {
        currentActiveItem = index;
        break;
      }
    }
    return currentActiveItem
  }

  calculateTimer(withDuration: boolean, actualTimer: number): string {
    const zeroPad = (num: string, places: number) => num.padStart(places, '0');
    let dur = this.props.timer.workoutTimeRawMap[actualTimer];
    if (dur) {
      dur = dur.replace(".", ":");
      const digits = dur.split(":");
      dur = `${zeroPad(digits[0], 2)}:${zeroPad(digits[1], 2)}`;
      const curTime = `${zeroPad((this.props.timer.curTime / 60).toString().split(".")[0], 2)}:${zeroPad(String(this.props.timer.curTime % 60), 2)}`
      return withDuration ? `${curTime} / ${dur}` : dur;
    }
    return `0`
  }

  onClickEvent() {
    this.clickWaitTimer.push(setTimeout(() => {
      this.props.changeStateClick("single");
    }, 200));
  }
  onDoubleClickEvent() {
    const len = this.clickWaitTimer.length;
    for (let i = 0; i < len; i++) {
      clearInterval(this.clickWaitTimer.pop());
    }
    this.props.changeStateClick("double");
  }



  public render(): JSX.Element {
    const actualTimer = this.calculateActualTimer()
    const timePercent = Number((this.props.timer.curTime / this.props.timer.workoutTimeMap[actualTimer]) * 100).toFixed(1)
    console.log(timePercent, this.props.timer.curTime)

    return (
      <>
        <section className={`in-h-screen flex flex-col justify-center ${actualTimer % 2 === 0 ? "bg-gradient-to-br via-sky-500 from-rose-500 to-indigo-200" : "bg-slate-50"}`}>
          <div className="flex flex-col justify-center sticky top-0 z-10 backdrop-blur h-[6rem] max-sm:h-[10rem]">
            <div className="w-full max-w-3xl mx-auto">
              <div
                onClick={this.onClickEvent.bind(this)}
                onDoubleClick={this.onDoubleClickEvent.bind(this)}
                className="flex flex-wrap gap-y-1 gap-x-1 justify-between text-4xl mb-6 mt-6 cursor-pointer">
                {actualTimer % 2 === 0 &&


                  <div className={`center grow-4 select-none whitespace-nowrap rounded-lg py-2 px-3.5 align-baseline font-sans  font-bold uppercase leading-none text-white bg-red-400 pl-0 pt-0 pb-0 pr-0 content-center`}>
                    <div className={`rounded-lg align-baseline py-[0.1rem] px-3.5  bg-red-600 content-center h-full pr-0 pl-0`} style={{ width: `${timePercent + "%"}` }}>
                      <span className="pl-2">
                        {this.calculateTimer(actualTimer % 2 === 0, actualTimer)}
                      </span>
                    </div>
                  </div>
                }

                <div className={`center grow max-sm:w-full ${actualTimer % 2 !== 0 ? "w-full" : ""} select-none whitespace-nowrap rounded-lg py-2 px-3.5 align-baseline font-sans  font-bold uppercase leading-none text-white bg-green-400 pl-0 pt-0 pb-0 pr-0 content-center`}>
                  <div className={`rounded-lg align-baseline py-[0.1rem] px-3.5  bg-green-600 content-center h-full pr-0 pl-0`} style={{ width: `${actualTimer % 2 !== 0 ? timePercent + "%" : "100%"}` }}>
                    <span className="pl-2">
                      {this.calculateTimer(actualTimer % 2 !== 0, actualTimer % 2 !== 0 ? actualTimer : actualTimer + 1)}
                    </span>
                  </div>
                </div>


              </div>
            </div>
          </div>
          <div className="w-full mx-auto px-4 md:px-6 py-10 snap-y overflow-y-scroll no-scrollbar max-h-[calc(100vh-6rem)] max-sm:max-h-[calc(100vh-10rem)]">
            <div className="flex flex-col justify-center divide-y divide-slate-200 scroll-mb-6">
              <div className="w-full max-w-3xl mx-auto">
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {this.createTimeLine()}
                </div>
              </div>
            </div>
            <ClipboardLoader onClick={this.props.onClick}></ClipboardLoader>
          </div>
        </section>
      </>
    )
  }
}
