import { FormControl, FormHelperText, FormLabel, Input, LinearProgress, Typography } from '@mui/joy'
import React from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { InfoOutlined } from '@mui/icons-material';
import clsx from 'clsx';

const PasswordCheck: React.FC<PasswordCheckProps> = ({ value, handleChange, errors, page }) => {
    const [visibility, setVisibility] = React.useState<boolean>(false);
    const minLength = 8;

    const handleVisibleClick = () => {
        setVisibility(!visibility);
    }

    // Function to determine password strength
    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= minLength) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[\W_]/.test(password)) strength += 1;
        return (strength / 5) * 100;
    }

    const strengthValue = getPasswordStrength(value.password);

    return (
        <FormControl error={errors?.password ? true : false}>
            <FormLabel className='!text-xs'>
                Password
            </FormLabel>
            <Input
                type={!visibility ? 'password' : 'text'}
                size='sm'
                className='w-full'
                name='password'
                value={value.password}
                onChange={(e) => handleChange(e)}
                endDecorator={!visibility ?
                    <VisibilityIcon
                        sx={{ cursor: 'pointer' }}
                        onClick={handleVisibleClick}
                    />
                    : <VisibilityOffIcon
                        sx={{ cursor: 'pointer' }}
                        onClick={handleVisibleClick}
                    />}
            />
            <FormHelperText className={clsx('!mt-1 !text-xs !flex !items-start', {'!hidden': !errors?.password || strengthValue > 0 })}>
                <InfoOutlined className='!text-sm' />
                {errors?.password && errors?.password}
            </FormHelperText>
            <div className={value.password === '' || page === 'login' ? '!hidden' : '!mt-1'}>
                <LinearProgress
                    determinate
                    size='sm'
                    value={strengthValue}
                    sx={{
                        bgcolor: 'background.level3',
                        color: strengthValue < 50 ? '#E52020' : 'hsl(var(--hue) 80% 49%)',
                    }}
                />
                <Typography className='text-end !text-xs !font-medium' sx={{ mt: 0.5 }}>
                    {strengthValue < 50 ? 'Weak' : strengthValue < 90 ? 'Medium' : 'Strong'}
                </Typography>
            </div>
        </FormControl>
    )
}

export default PasswordCheck;