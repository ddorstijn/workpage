import { Component, Setter } from "solid-js";
import "./ExpandSearch.css";

interface Props {
  setSearch: Setter<string>;
}

export const ExpandSearch: Component<Props> = (props) => {
  return (
    <label class="expand-search">
      <input
        name="search"
        type="search"
        placeholder="Search item"
        onInput={(e) => props.setSearch((e.target as HTMLInputElement).value)}
      />
      <i class="ph ph-magnifying-glass"></i>
    </label>
  );
};
