import { motion } from 'motion/react';
import { Droplet } from 'lucide-react';

export function WaterDropAnimation() {
  const drops = [0, 1, 2, 3, 4];

  return (
    <div className="relative h-24 overflow-hidden">
      <div className="absolute inset-0 flex justify-center items-center gap-6">
        {drops.map((index) => (
          <motion.div
            key={index}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3,
              ease: "easeIn"
            }}
          >
            <Droplet className="w-6 h-6 text-blue-400 fill-blue-400" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
