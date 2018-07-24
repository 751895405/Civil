import React from "react";

import hljs from "highlight.js";
// import hljsDefineSolidity from "highlightjs-solidity"
// import "../css/hljs-atom-one.css"

// hljsDefineSolidity(hljs);

export interface SourceProps {
  contract: any;
}

export interface SourceState {
  renderHack: boolean;
}

export default class Source extends React.Component<SourceProps, SourceState> {
  private highlight: HTMLPreElement | null;
  constructor(props: SourceProps) {
    super(props);
    this.state = {
      renderHack: false,
    };
  }
  public componentDidMount(): void {
    hljs.highlightBlock(this.refs.highlight);
  }
  public componentWillReceiveProps(): void {
    this.state = { renderHack: true };
    setTimeout(() => {
      this.setState({ renderHack: false });
      hljs.highlightBlock(this.refs.highlight);
    }, 0);
  }
  public render(): JSX.Element {
    const { contract } = this.props;
    return (
      <div className="source">
        {!this.state.renderHack && (
          <pre ref={highlight => (this.highlight = highlight)}>
            <code>{contract.source}</code>
          </pre>
        )}
      </div>
    );
  }
}
