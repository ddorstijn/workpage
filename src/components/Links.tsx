import { Component } from "solid-js";

const Links: Component<{class: string}> = (props) => {
  return (
    <ol {...props}>
    </ol>
  )
}

export default Links;