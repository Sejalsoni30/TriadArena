import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      addToast({ type: 'success', title: 'Reset Email Sent', message: 'Check your inbox for instructions' });
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent-cyan mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>

          {isSent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h2 className="text-xl font-display font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-xs text-gray-300 mb-6">
                We've dispatched a recovery link to <span className="text-accent-cyan">{email}</span>.
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-display font-bold text-white mb-2">Reset Password</h1>
              <p className="text-xs text-gray-400 mb-6">
                Enter your registered email and we'll send you a password reset link.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gladiator@triad.io"
                  icon={<Mail className="w-4 h-4" />}
                  required
                />
                <Button type="submit" variant="accent" size="md" className="w-full mt-2" isLoading={isLoading}>
                  Send Reset Link
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};
