import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  return (
    <Disclosure
      as="nav"
      className="fixed top-0 left-0 right-0  bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex gap-2 shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
              <h1 className="font-bold text-mutes  text-xl">MyTrancy</h1>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 hidden sm:flex items-center gap-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              onClick={() => console.log("Download CSV")}
              className="rounded-md bg-mutes/20 px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white"
            >
              CSV
            </button>
            <button
              type="button"
              onClick={() => console.log("Download JSON")}
              className="rounded-md bg-mutes/20 px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white"
            >
              JSON
            </button>
            <button
              type="button"
              onClick={() => console.log("Log out")}
              className="rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-400"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3 bg-gray-800">
          <div className="flex flex-col gap-2 pt-2">
            <button className="rounded-md bg-white/5 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white">
              Download CSV
            </button>
            <button className="rounded-md bg-white/5 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white">
              Download JSON
            </button>
            <button className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400">
              Log out
            </button>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
