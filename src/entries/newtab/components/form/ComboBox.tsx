import * as combobox from "@zag-js/combobox"
import { normalizeProps, useMachine } from "@zag-js/solid"
import { Component, createMemo, createSignal, createUniqueId, For, Show } from "solid-js"

interface Option {
  value: string,
  label: string,
}

interface Props {
  placeholder: string,
  name: string,
  required: boolean,
  options: Option[],
}

const ComboBox: Component<Props> = (props) => {
  const [options, setOptions] = createSignal<Option[]>(props.options)

  const [state, send] = useMachine(
    combobox.machine({
      id: createUniqueId(),
      onOpen() {
        setOptions(props.options)
      },
      onInputChange({ value }) {
        const filtered = props.options.filter((item) =>
          item.label.toLowerCase().includes(value.toLowerCase()),
        )
        setOptions(filtered.length > 0 ? filtered : props.options)
      },
    }),
  );

  const api = createMemo(() => combobox.connect(state, send, normalizeProps))

  return (
    <div>
      <div {...api().rootProps}>
        <label {...api().labelProps}>Select country</label>
        <div {...api().controlProps}>
          <input {...api().inputProps} />
          <button {...api().triggerProps}>▼</button>
        </div>
      </div>
      <div {...api().positionerProps}>
        <Show when={options().length > 0}>
          <ul {...api().contentProps}>
            <For each={options()}>
              {(item, index) => (
                <li
                  {...api().getOptionProps({
                    label: item.label,
                    value: item.value,
                    index: index()
                  })}
                >
                  {item.label}
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
    </div>
  )
}

export default ComboBox;
