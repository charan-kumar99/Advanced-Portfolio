'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

function Button({
  hoverScale = 1.05,
  tapScale = 0.95,
  children,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: tapScale }}
      whileHover={{ scale: hoverScale }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export { Button };
