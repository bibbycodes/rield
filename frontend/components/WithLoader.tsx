import {CircularProgress, LinearProgress, Skeleton} from "@mui/material";
import {theme} from "../styles/theme";

interface WithLoaderProps {
  isLoading: boolean;
  children: JSX.Element;
  className?: string;
  size?: number;
  width?: number;
  height?: number;
  type?: 'circular' | 'linear' | 'spinner' | 'rectangular' | 'text';
}

export const WithLoader = ({isLoading, children, className, type, size, width, height}: WithLoaderProps) => {
  const getLoader = () => {
    switch (type) {
      case 'circular':
        return <Skeleton height={height} width={width} variant="circular"/>
      case 'linear':
        return <LinearProgress/>
      case 'text':
        return <Skeleton sx={{ fontSize: '2rem', bgcolor: theme.tSecondary }} variant="text"/>
      case 'rectangular':
        return <Skeleton height={height} width={width} variant="rectangular"/>
      case 'spinner':
        return <CircularProgress size={size}/>
      default:
        return <p>Loading...</p>
    }
  }
  return (
    <div className={`${className} w-full`}>
      {isLoading ? getLoader() : children}
    </div>
  )
}
