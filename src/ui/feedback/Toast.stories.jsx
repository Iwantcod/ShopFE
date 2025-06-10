import { ToastProvider, useToast } from '../src/ui/feedback/toastContext';
import Button from '../src/ui/core/Button';

export default { title: 'Feedback/Toast' };

function Demo() {
  const toast = useToast();
  return (
    <div className="space-x-2">
      <Button onClick={() => toast.push('일반 메시지')}>Info</Button>
      <Button onClick={() => toast.success('성공!')}>Success</Button>
      <Button variant="danger" onClick={() => toast.error('에러!')}>
        Error
      </Button>
    </div>
  );
}

export const Playground = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};
