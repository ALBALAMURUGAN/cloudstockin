import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="p-4 rounded-2xl bg-brown-100 mb-4">
        <Icon className="w-10 h-10 text-brown-400" />
      </div>
      <h3 className="text-lg font-semibold text-brown-700 mb-1">{title}</h3>
      <p className="text-sm text-brown-400 text-center max-w-sm mb-4">{description}</p>
      {action}
    </motion.div>
  );
}
