'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        ref.current = node;
      }
    });
  };
}

function mergeProps(childProps, slotProps) {
  const merged = { ...childProps, ...slotProps };

  if (childProps.className || slotProps.className) {
    merged.className = cn(
      childProps.className,
      slotProps.className,
    );
  }

  if (childProps.style || slotProps.style) {
    merged.style = {
      ...childProps.style,
      ...slotProps.style,
    };
  }

  return merged;
}

function Slot({
  children,
  ref,
  ...props
}) {
  if (!React.isValidElement(children)) return null;

  const childType = children.type;

  // Check if it's already a motion component by checking for motion-specific properties
  const isAlreadyMotion =
    typeof childType === 'object' &&
    childType !== null &&
    ('render' in childType || '_payload' in childType);

  // For framer-motion, we use motion() factory function
  const Base = React.useMemo(
    () => {
      if (isAlreadyMotion) {
        return childType;
      }
      // Use motion() for HTML elements, otherwise wrap with motion.div
      if (typeof childType === 'string') {
        return motion[childType] || motion.div;
      }
      return motion.div;
    },
    [isAlreadyMotion, childType],
  );

  const { ref: childRef, ...childProps } = children.props;

  const mergedProps = mergeProps(childProps, props);

  return (
    <Base {...mergedProps} ref={mergeRefs(childRef, ref)} />
  );
}

export { Slot };
