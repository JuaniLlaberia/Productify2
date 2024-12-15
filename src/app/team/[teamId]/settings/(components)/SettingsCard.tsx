import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type SettingsCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  variant?: 'normal' | 'danger';
  footerMsg?: string;
};

const SettingsCard = ({
  title,
  description,
  children,
  variant = 'normal',
  footerMsg,
}: SettingsCardProps) => {
  return (
    <Card
      x-chunk='dashboard-04-chunk-1'
      className={cn(
        'max-w-[600px]',
        variant === 'danger' ? 'border-destructive' : 'border-border'
      )}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footerMsg && (
        <CardFooter
          className={cn(
            'flex items-center justify-between border-t px-6 py-4',
            variant === 'danger'
              ? 'bg-destructive/40 border-destructive'
              : 'bg-muted/30 border-border'
          )}
        >
          <p className='text-sm text-muted-foreground'>{footerMsg}</p>
        </CardFooter>
      )}
    </Card>
  );
};

export default SettingsCard;
