"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/data/site";
import { ease } from "@/lib/motion";
import { useReveal } from "@/lib/use-reveal";

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };

/**
 * FAQ accordion: several items can be open, the first is open on load.
 * hiddenUntilFound keeps closed answers in the DOM (hidden="until-found"), so Ctrl+F can find and open them.
 */
export function FaqList({ items }: { items: FaqItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useReveal(ref);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shown ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
    >
      <AccordionPrimitive.Root
        multiple
        hiddenUntilFound
        defaultValue={[items[0]?.id]}
        className="divide-y divide-rust/15 border-y border-rust/15"
      >
        {items.map((f) => (
          <motion.div key={f.id} variants={item}>
            <AccordionPrimitive.Item value={f.id}>
              {/* renders an <h3> */}
              <AccordionPrimitive.Header className="m-0">
                <AccordionPrimitive.Trigger
                  id={`faq-q-${f.id}`}
                  className="group flex w-full cursor-pointer items-start justify-between gap-6 rounded-sm py-6 text-left focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span className="pt-1 font-heading text-[clamp(1.125rem,1.6vw,1.375rem)] leading-[1.3] font-medium text-ink transition-colors duration-200 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-rust">
                    {f.q}
                  </span>
                  <span
                    aria-hidden
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-cream text-rust transition-colors duration-300 group-data-[panel-open]:bg-rust group-data-[panel-open]:text-white"
                  >
                    <Plus
                      className="size-5 transition-transform duration-300 group-data-[panel-open]:rotate-45 motion-reduce:transition-none"
                      strokeWidth={1.5}
                    />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
                <p className="max-w-[58ch] pr-12 pb-6 text-[15px] leading-[1.7] text-ink/75">{f.a}</p>
              </AccordionPrimitive.Panel>
            </AccordionPrimitive.Item>
          </motion.div>
        ))}
      </AccordionPrimitive.Root>
    </motion.div>
  );
}
