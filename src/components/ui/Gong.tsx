import React from "react";
import { Workout } from "../interfaces/workout";
import TimeLineItem from "./TimeLineItem";

interface Props {
  workout?: Array<Array<Workout>>
}

interface State {
  clicks: number;
}

const initialState: State = {
  clicks: 0
};

export default class Gong extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  componentDidUpdate(_prevProps: Props, _prevState: State): void {
    console.log("componentDidUpdate")
  }

  public render(): JSX.Element {
    return (
      <>
        <audio className="my_audio hidden" controls preload="none">
          <source src="gong.wav" type="audio/wav" />
        </audio>
      </>
    )
  }
}
