import React from "react";

interface Props {
  onClick: () => void
}

interface State {
  clicks: number;
}

const initialState: State = {
  clicks: 0
};

export default class ClipboardLoader extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  componentDidUpdate(_prevProps: Props, _prevState: State): void {
  }

  public render(): JSX.Element {
    return (
      <>
        <div className="flex flex-col justify-center cursor-pointer top-0 z-10" onClick={this.props.onClick}>
          <div className="w-full max-w-3xl mx-auto">
            <div className="flex justify-between text-4xl mb-6 mt-6 ">
              <div className={`center min-w-2/12 select-none whitespace-nowrap rounded-lg py-2 px-3.5 align-baseline font-sans leading-none text-black text-center bg-neutral-300 w-full`}>
                <div className="">Load from clipboard</div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
