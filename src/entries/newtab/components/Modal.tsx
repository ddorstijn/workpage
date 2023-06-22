import { Component, JSX } from "solid-js";

interface Props {
  title: string,
  icon: string,
  children: JSX.Element
}

const Modal: Component<Props> = (props) => {
  return (
    <p>test</p>
    // <Dialog.Root modal={true}>
    //   <Dialog.Trigger>
    //     <span class={"hover:text-gray-900 " + props.icon}></span>
    //   </Dialog.Trigger>
    //   <Dialog.Portal>
    //     <Dialog.Overlay class="fixed inset-0 z-10 bg-dark opacity-20" />
    //     <div class="z-20 fixed inset-0 grid place-items-center">
    //       <Dialog.Content class="p-4 rounded-lg bg-orange-50 border-solid border-1 border-amber-100 .dark:bg-dark-7">
    //         <div class="flex items-center mb-2">
    //           <Dialog.Title class="font-bold text-lg">{props.title}</Dialog.Title>
    //           <Dialog.CloseButton class="ml-auto">
    //             <span class="i-ic:baseline-close"></span>
    //           </Dialog.CloseButton>
    //         </div>
    //         <Dialog.Description>
    //           {props.children}
    //         </Dialog.Description>
    //       </Dialog.Content>
    //     </div>
    //   </Dialog.Portal>
    // </Dialog.Root>
  )
}

export default Modal;
