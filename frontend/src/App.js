import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ChakraBaseProvider,
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Avatar,
  AvatarGroup,
  Card,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Container,
  useMediaQuery,
  extendTheme,
  SimpleGrid,
  Icon,
  Link,
  Divider,
  Badge,
  Progress,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tooltip as ChakraTooltip,
  Skeleton,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { 
  SearchIcon, 
  ChevronRightIcon, 
  StarIcon, 
  TimeIcon, 
  ChatIcon, 
  ExternalLinkIcon,
  HamburgerIcon,
  CloseIcon,
  SettingsIcon
} from '@chakra-ui/icons';
import { 
  FaTwitter, 
  FaHashtag, 
  FaChartPie, 
  FaRegSmile, 
  FaRegFrown, 
  FaRegMeh,
  FaGithub,
  FaLinkedin,
  FaTwitter as FaTwitterBrand,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Custom components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionButton = motion(Button);

// Custom theme with forkyoudev-inspired colors
const theme = extendTheme({
  styles: {
    global: (props) => ({
      'body': {
        bg: '#0A0E17',
        color: 'white',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: '1.5',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      'h1, h2, h3, h4, h5, h6': {
        fontWeight: '700',
        letterSpacing: '-0.02em',
      },
      'button:focus': {
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(255, 128, 89, 0.4)',
      },
      '::-webkit-scrollbar': {
        width: '6px',
        height: '6px',
      },
      '::-webkit-scrollbar-track': {
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '3px',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '3px',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.15)',
        },
      },
    }),
  },
  colors: {
    brand: {
      50: '#FFE8E0',
      100: '#FFC0A8',
      200: '#FF9A70',
      300: '#FF7A38',
      400: '#FF6B1A',
      500: '#FF5C00',
      600: '#E55300',
      700: '#CC4A00',
      800: '#B34100',
      900: '#993800',
    },
    accent: {
      50: '#E6F3FF',
      100: '#B8DBFF',
      200: '#8AC4FF',
      300: '#5CACFF',
      400: '#2E95FF',
      500: '#007BFF',
      600: '#0066D4',
      700: '#0052AA',
      800: '#003D7F',
      900: '#002955',
    },
    gray: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    dark: {
      50: '#1A1F2E',
      100: '#161B28',
      200: '#121722',
      300: '#0E121C',
      400: '#0C0F17',
      500: '#0A0E17',
      600: '#080C13',
      700: '#06090F',
      800: '#04070B',
      900: '#020407',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: '12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        _focus: {
          boxShadow: '0 0 0 3px rgba(255, 128, 89, 0.4)',
        },
        _hover: {
          transform: 'translateY(-1px)',
        },
        _active: {
          transform: 'translateY(0)',
        },
      },
      variants: {
        solid: (props) => ({
          bg: 'linear-gradient(135deg, #FF7A38 0%, #FF5C00 100%)',
          color: 'white',
          _hover: {
            bg: 'linear-gradient(135deg, #FF8A4D 0%, #FF6B1A 100%)',
            _disabled: {
              bg: 'linear-gradient(135deg, #FF7A38 0%, #FF5C00 100%)',
            },
          },
          _active: {
            bg: 'linear-gradient(135deg, #E56B32 0%, #E55300 100%)',
          },
          boxShadow: '0 4px 14px 0 rgba(255, 92, 0, 0.3)',
        }),
        ghost: {
          bg: 'rgba(255, 255, 255, 0.03)',
          _hover: {
            bg: 'rgba(255, 255, 255, 0.08)',
          },
          _active: {
            bg: 'rgba(255, 255, 255, 0.12)',
          },
        },
        outline: {
          border: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          _hover: {
            bg: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
        },
      },
      defaultProps: {
        variant: 'solid',
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: '12px',
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
      variants: {
        filled: {
          field: {
            bg: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            _hover: {
              bg: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            _focus: {
              bg: 'rgba(255, 255, 255, 0.07)',
              borderColor: 'brand.500',
            },
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&:active': {
            transform: 'translateY(-2px)',
          },
        },
      },
      variants: {
        elevated: {
          container: {
            bg: 'rgba(255, 255, 255, 0.03)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
  },
  shadows: {
    outline: '0 0 0 3px rgba(255, 128, 89, 0.4)',
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

// Sentiment analysis constants
const COLORS = ['#4ADE80', '#F87171', '#94A3B8'];
const sentimentVariants = {
  positive: { 
    bg: 'rgba(72, 187, 120, 0.13)', 
    color: '#48bb78',
    icon: FaRegSmile,
    label: 'Positive',
    value: 'positive'
  },
  negative: { 
    bg: 'rgba(248, 113, 113, 0.13)', 
    color: '#f87171',
    icon: FaRegFrown,
    label: 'Negative',
    value: 'negative'
  },
  neutral: { 
    bg: 'rgba(156, 163, 175, 0.13)', 
    color: '#9ca3af',
    icon: FaRegMeh,
    label: 'Neutral',
    value: 'neutral'
  }
};

// Loading spinner component with smooth animation
const LoadingSpinner = ({ size = 6, color = 'brand.500' }) => {
  return (
    <Box 
      display="inline-block" 
      position="relative" 
      width={`${size * 4}px`} 
      height={`${size * 4}px`}
      role="status"
      aria-label="Loading..."
    >
      <MotionBox
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        border="2px solid"
        borderColor="rgba(255, 255, 255, 0.05)"
        borderRadius="50%"
      />
      <MotionBox
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        border="2px solid transparent"
        borderTopColor={color}
        borderRightColor={color}
        borderBottomColor={color}
        borderRadius="50%"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity,
        }}
      />
    </Box>
  );
};

// Tweet card component
const TweetCard = ({ tweet }) => {
  const { icon: SentimentIcon, color } = sentimentVariants[tweet.sentiment] || {};
  const formattedDate = new Date(tweet.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <MotionBox
      bg="white"
      p={4}
      borderRadius="lg"
      borderLeft="4px solid"
      borderLeftColor={color}
      boxShadow="sm"
      _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      mb={4}
    >
      <Flex justify="space-between" mb={2}>
        <Flex align="center">
          <Avatar name={tweet.user} size="sm" mr={2} />
          <Text fontWeight="medium">@{tweet.user}</Text>
        </Flex>
        <Flex align="center">
          <TimeIcon mr={1} color="gray.500" boxSize={3} />
          <Text fontSize="sm" color="gray.500">
            {formattedDate}
          </Text>
        </Flex>
      </Flex>
      <Text mb={3} color="gray.800">
        {tweet.text}
      </Text>
      <Flex justify="space-between" align="center">
        <Badge 
          px={2} 
          py={1} 
          borderRadius="full" 
          bg={`${color}1A`}
          color={color}
          display="flex"
          alignItems="center"
          textTransform="capitalize"
        >
          {SentimentIcon && <Icon as={SentimentIcon} mr={1} />}
          {tweet.sentiment}
        </Badge>
        <HStack spacing={2}>
          <HStack spacing={1} color="gray.500">
            <FaTwitter />
            <Text fontSize="sm">{tweet.likes}</Text>
          </HStack>
          <HStack spacing={1} color="gray.500">
            <Icon as={ChatIcon} />
            <Text fontSize="sm">{tweet.replies}</Text>
          </HStack>
          <HStack spacing={1} color="gray.500">
            <Icon as={ExternalLinkIcon} />
            <Text fontSize="sm">{tweet.retweets}</Text>
          </HStack>
        </HStack>
      </Flex>
    </MotionBox>
  );
};

// Sentiment summary card component
const SentimentSummary = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card p={6} borderRadius="lg" boxShadow="sm" bg="white" mb={6}>
      <Heading size="md" mb={4} color="gray.800">Sentiment Analysis</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box>
          <Text color="gray.600" mb={4}>
            Distribution of sentiments across analyzed tweets
          </Text>
          <Box h="200px">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    value,
                    `${name} (${((value / total) * 100).toFixed(1)}%)`
                  ]}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom"
                  formatter={(value) => (
                    <Text as="span" color="gray.600" fontSize="sm">
                      {value}
                    </Text>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
        <Box>
          <Text color="gray.600" mb={4}>
            Sentiment breakdown
          </Text>
          <VStack spacing={4} align="stretch">
            {data.map((item, index) => (
              <Box key={index}>
                <Flex justify="space-between" mb={1}>
                  <Flex align="center">
                    <Icon 
                      as={sentimentVariants[item.value.toLowerCase()]?.icon} 
                      mr={2} 
                      color={item.color} 
                    />
                    <Text color="gray.700" fontSize="sm">
                      {item.name}
                    </Text>
                  </Flex>
                  <Text color="gray.700" fontSize="sm" fontWeight="medium">
                    {item.value} ({((item.value / total) * 100).toFixed(0)}%)
                  </Text>
                </Flex>
                <Progress 
                  value={(item.value / total) * 100} 
                  size="sm" 
                  colorScheme={
                    item.name.toLowerCase() === 'positive' ? 'green' : 
                    item.name.toLowerCase() === 'negative' ? 'red' : 'gray'
                  }
                  borderRadius="full" 
                  bg="gray.100"
                />
              </Box>
            ))}
          </VStack>
        </Box>
      </SimpleGrid>
    </Card>
  );
};

// Sample tweets data for demonstration
const sampleTweets = [
  {
    id: '1',
    user: 'user1',
    text: 'This is a positive tweet about the new product! #happy',
    sentiment: 'positive',
    likes: 42,
    retweets: 12,
    replies: 5,
    timestamp: '2023-06-01T10:30:00Z'
  },
  {
    id: '2',
    user: 'user2',
    text: 'I am not happy with the service. Very disappointed! #unhappy',
    sentiment: 'negative',
    likes: 8,
    retweets: 2,
    replies: 1,
    timestamp: '2023-06-01T11:15:00Z'
  },
  {
    id: '3',
    user: 'user3',
    text: 'Just sharing some thoughts on the latest tech news.',
    sentiment: 'neutral',
    likes: 15,
    retweets: 3,
    replies: 2,
    timestamp: '2023-06-01T12:00:00Z'
  }
];

// Format tweet text to handle links, mentions, and hashtags
const formatTweetText = (text) => {
  if (!text) return '';
  
  // Replace URLs with clickable links
  let formattedText = text.replace(
    /(https?:\/\/[^\s]+)/g, 
    (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #4299e1;">${url}</a>`
  );
  
  // Replace mentions with clickable links
  formattedText = formattedText.replace(
    /@(\w+)/g, 
    (mention) => `<a href="https://twitter.com/${mention.substring(1)}" target="_blank" rel="noopener noreferrer" style="color: #4299e1;">${mention}</a>`
  );
  
  // Replace hashtags with clickable links
  formattedText = formattedText.replace(
    /#(\w+)/g, 
    (hashtag) => `<a href="https://twitter.com/hashtag/${hashtag.substring(1)}" target="_blank" rel="noopener noreferrer" style="color: #4299e1;">${hashtag}</a>`
  );
  
  return formattedText;
};

export default function App() {
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(10);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  
  // Calculate sentiment data
  const sentimentData = React.useMemo(() => [
    { 
      name: 'Positive', 
      value: tweets.filter((t) => t.sentiment === 'positive').length, 
      color: sentimentVariants.positive.color,
      icon: FaRegSmile
    },
    { 
      name: 'Negative', 
      value: tweets.filter((t) => t.sentiment === 'negative').length, 
      color: sentimentVariants.negative.color,
      icon: FaRegFrown
    },
    { 
      name: 'Neutral', 
      value: tweets.filter((t) => t.sentiment === 'neutral').length, 
      color: sentimentVariants.neutral.color,
      icon: FaRegMeh
    },
  ].filter(item => item.value > 0), [tweets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // In a real app, you would make an API call here
      // const response = await axios.post('http://127.0.0.1:8000/analyze/', {
      //   query: query.trim(),
      //   count: Math.min(Math.max(1, Number(count)), 100),
      // });
      // setTweets(response.data || []);
      
      // For demo purposes, we'll use the sample data
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTweets(sampleTweets);
      
      toast({
        title: 'Analysis complete!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 
                     err.message || 
                     'An error occurred while fetching tweets';
      setError(errorMsg);
      toast({
        title: 'Error',
        description: errorMsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Format number with K/M/B suffix
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  // Calculate total engagement
  const totalEngagement = tweets.reduce((sum, tweet) => (
    sum + tweet.likes + tweet.retweets + tweet.replies
  ), 0);

  return (
    <ChakraBaseProvider theme={theme}>
      {/* Header Section */}
      <Box as="header" bg="gray.900" borderBottom="1px" borderColor="gray.800" position="sticky" top={0} zIndex={10}>
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <Flex align="center">
              <Icon as={FaTwitter} color="brand.500" boxSize={6} mr={2} />
              <Text fontSize="xl" fontWeight="bold" color="white">
                Sentiment<span style={{ color: '#805AD5' }}>X</span>
              </Text>
            </Flex>
            <HStack spacing={4}>
              <Button size="sm" variant="ghost" colorScheme="gray" leftIcon={<FaGithub />} as="a" href="https://github.com" target="_blank">
                GitHub
              </Button>
              <Button size="sm" colorScheme="purple" leftIcon={<FaTwitter />} as="a" href="https://twitter.com" target="_blank">
                Follow
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Box as="main" minH="calc(100vh - 64px)" bg="gray.900" py={8}>
        <Container maxW="container.xl">
          {/* Hero Section */}
          <Box as="section" mb={16} textAlign="center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="full" mb={4}>
                🚀 Powered by AI
              </Badge>
              <Heading as="h1" size="2xl" color="white" mb={4} lineHeight="tall">
                Analyze Twitter Sentiment in Real-Time
              </Heading>
              <Text color="gray.400" maxW="2xl" mx="auto" mb={8} fontSize="lg">
                Discover insights from Twitter data with our powerful sentiment analysis tool. 
                Understand public opinion on any topic with just a few clicks.
              </Text>
              
              {/* Search Form */}
              <Card p={6} maxW="2xl" mx="auto" bg="gray.800" borderRadius="xl" boxShadow="xl">
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <Input
                      placeholder="Search topic, hashtag, or brand..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      size="lg"
                      bg="gray.800"
                      color="white"
                      borderColor="gray.700"
                      _hover={{ borderColor: 'gray.600' }}
                      _focus={{
                        borderColor: 'brand.100',
                        boxShadow: '0 0 0 1px var(--chakra-colors-brand-100)'
                      }}
                      _placeholder={{ color: 'gray.500' }}
                      isDisabled={loading}
                      required
                    />
                    <Input
                      type="number"
                      placeholder="Number of tweets (1-100)"
                      value={count}
                      onChange={(e) => setCount(parseInt(e.target.value) || 10)}
                      min={1}
                      max={100}
                      size="lg"
                      bg="gray.800"
                      color="white"
                      borderColor="gray.700"
                      _hover={{ borderColor: 'gray.600' }}
                      _focus={{
                        borderColor: 'brand.100',
                        boxShadow: '0 0 0 1px var(--chakra-colors-brand-100)'
                      }}
                      _placeholder={{ color: 'gray.500' }}
                      isDisabled={loading}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      width="100%"
                      bgGradient="linear(to-r, brand.100, brand.300)"
                      color="white"
                      _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: 'lg',
                      }}
                      _active={{
                        transform: 'translateY(0)',
                      }}
                      isLoading={loading}
                      loadingText="Analyzing..."
                      rightIcon={loading ? null : <Box as="span">⏎</Box>}
                      fontWeight="bold"
                      letterSpacing="wide"
                      textTransform="uppercase"
                      fontSize="sm"
                    >
                      {loading ? 'Analyzing...' : 'Analyze Tweets'}
                    </Button>
                  </VStack>
                </form>

                {error && (
                  <Alert status="error" mt={4} borderRadius="md" variant="left-accent">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Error</AlertTitle>
                      <Text fontSize="sm">{error}</Text>
                    </Box>
                  </Alert>
                )}
              </Card>
            </motion.div>
          </Box>

          {/* Results Section */}
          {tweets.length > 0 && (
            <Box as="section" mb={16}>
              <Heading size="xl" color="white" mb={6}>
                Analysis Results
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                {/* Sentiment Overview */}
                <Card p={6} bg="gray.800" borderRadius="xl">
                  <Text color="gray.400" fontSize="sm" mb={2}>Total Tweets</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="white">{tweets.length}</Text>
                  <Flex align="center" mt={2}>
                    <Box w="12px" h="12px" bg="green.500" borderRadius="full" mr={2} />
                    <Text color="gray.400" fontSize="sm">Analyzed in real-time</Text>
                  </Flex>
                </Card>

                {/* Engagement Stats */}
                <Card p={6} bg="gray.800" borderRadius="xl">
                  <Text color="gray.400" fontSize="sm" mb={2}>Total Engagement</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="white">{formatNumber(totalEngagement)}</Text>
                  <Flex mt={2} color="gray.500" fontSize="sm">
                    <Text mr={4}><Text as="span" color="red.400">❤️ {formatNumber(tweets.reduce((sum, t) => sum + t.likes, 0))}</Text> Likes</Text>
                    <Text mr={4}><Text as="span" color="blue.400">🔄 {formatNumber(tweets.reduce((sum, t) => sum + t.retweets, 0))}</Text> Retweets</Text>
                    <Text><Text as="span" color="green.400">💬 {formatNumber(tweets.reduce((sum, t) => sum + t.replies, 0))}</Text> Replies</Text>
                  </Flex>
                </Card>

                {/* Sentiment Distribution */}
                <Card p={6} bg="gray.800" borderRadius="xl">
                  <Text color="gray.400" fontSize="sm" mb={2}>Sentiment Distribution</Text>
                  <Box h="60px" mt={2}>
                    {sentimentData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sentimentData}
                            cx="50%"
                            cy="50%"
                            innerRadius={20}
                            outerRadius={30}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {sentimentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Text color="gray.500" fontSize="sm">No data available</Text>
                    )}
                  </Box>
                  <Flex justify="space-between" mt={4}>
                    {sentimentData.map((item, index) => (
                      <Flex key={index} align="center">
                        <Box w="10px" h="10px" bg={item.color} borderRadius="full" mr={2} />
                        <Text color="gray.400" fontSize="sm">{item.name}: {item.value}</Text>
                      </Flex>
                    ))}
                  </Flex>
                </Card>

                {/* Quick Stats */}
                <Card p={6} bg="gray.800" borderRadius="xl">
                  <Text color="gray.400" fontSize="sm" mb={2}>Quick Stats</Text>
                  <VStack align="stretch" spacing={3}>
                    <Flex justify="space-between">
                      <Text color="gray.400">Avg. Likes</Text>
                      <Text color="white">
                        {tweets.length > 0 
                          ? formatNumber(tweets.reduce((sum, t) => sum + t.likes, 0) / tweets.length) 
                          : 0}
                      </Text>
                    </Flex>
                    <Divider borderColor="gray.700" />
                    <Flex justify="space-between">
                      <Text color="gray.400">Avg. Retweets</Text>
                      <Text color="white">
                        {tweets.length > 0 
                          ? formatNumber(tweets.reduce((sum, t) => sum + t.retweets, 0) / tweets.length) 
                          : 0}
                      </Text>
                    </Flex>
                    <Divider borderColor="gray.700" />
                    <Flex justify="space-between">
                      <Text color="gray.400">Avg. Replies</Text>
                      <Text color="white">
                        {tweets.length > 0 
                          ? formatNumber(tweets.reduce((sum, t) => sum + t.replies, 0) / tweets.length) 
                          : 0}
                      </Text>
                    </Flex>
                  </VStack>
                </Card>
              </SimpleGrid>

              {/* Sentiment Summary */}
              <SentimentSummary data={sentimentData} />
              
              {/* Tweets List */}
              <Box mt={12}>
                <Heading size="lg" color="white" mb={6}>
                  Recent Tweets
                </Heading>
                <VStack spacing={4} align="stretch">
                  {tweets.map((tweet, index) => (
                    <TweetCard key={tweet.id || index} tweet={tweet} />
                  ))}
                </VStack>
              </Box>
            </Box>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box as="footer" bg="gray.900" borderTop="1px" borderColor="gray.800" py={8}>
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
            <Flex align="center" mb={{ base: 4, md: 0 }}>
              <Icon as={FaTwitter} color="brand.500" boxSize={6} mr={2} />
              <Text fontSize="lg" fontWeight="bold" color="white">
                Sentiment<span style={{ color: '#805AD5' }}>X</span>
              </Text>
            </Flex>
            <Text color="gray.500" textAlign="center" mb={{ base: 4, md: 0 }}>
              © {new Date().getFullYear()} SentimentX. All rights reserved.
            </Text>
            <HStack spacing={4}>
              <IconButton
                aria-label="GitHub"
                icon={<FaGithub />}
                as="a"
                href="https://github.com"
                target="_blank"
                variant="ghost"
                colorScheme="gray"
              />
              <IconButton
                aria-label="Twitter"
                icon={<FaTwitter />}
                as="a"
                href="https://twitter.com"
                target="_blank"
                variant="ghost"
                colorScheme="gray"
              />
              <IconButton
                aria-label="LinkedIn"
                icon={<FaLinkedin />}
                as="a"
                href="https://www.linkedin.com"
                target="_blank"
                variant="ghost"
                colorScheme="gray"
              />
            </HStack>
          </Flex>
        </Container>
      </Box>
            }}
          >
            {tweets.length > 0 ? (
              <>
                <Heading size="lg" mb={6} color="white" fontWeight={700}>
                  Analysis Results
                </Heading>
                
                <Box mb={8} bg="gray.800" p={4} borderRadius="lg">
                  <Text fontSize="md" color="gray.400" mb={3} fontWeight={500}>
                    Sentiment Distribution
                  </Text>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color || COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom"
                        formatter={(value, entry, index) => (
                          <Text as="span" color="gray.400" fontSize="sm">
                            {value}
                          </Text>
                        )}
                      />
                      <Tooltip 
                        formatter={(value, name) => [
                          value,
                          `${name} (${((value / tweets.length) * 100).toFixed(1)}%)`
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <Box>
                  <Text fontSize="md" color="gray.400" mb={3} fontWeight={500}>
                    Recent Tweets
                  </Text>
                  <VStack spacing={3} align="stretch" maxH="400px" overflowY="auto" pr={2}>
                    {tweets.map((tweet, idx) => (
                      <Box
                        key={idx}
                        bg={sentimentVariants[tweet.sentiment]?.bg || 'gray.800'}
                        p={4}
                        borderRadius="lg"
                        borderLeft="4px solid"
                        borderLeftColor={sentimentVariants[tweet.sentiment]?.color || 'gray.500'}
                        _hover={{ transform: 'translateX(4px)' }}
                        transition="all 0.2s"
                      >
                        <HStack mb={2}>
                          <Box
                            as="span"
                            px={2}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="bold"
                            textTransform="uppercase"
                            letterSpacing="wide"
                            color={sentimentVariants[tweet.sentiment]?.color || 'gray.400'}
                            bg="rgba(0,0,0,0.2)"
                          >
                            {tweet.sentiment}
                          </Box>
                        </HStack>
                        <Text 
                          color="white" 
                          fontSize="sm"
                          lineHeight="tall"
                          dangerouslySetInnerHTML={{ __html: formatTweetText(tweet.text) }}
                        />
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </>
            ) : (
              <VStack spacing={4} textAlign="center" py={8}>
                <Box
                  p={4}
                  borderRadius="full"
                  bg="rgba(255, 128, 89, 0.1)"
                  color="brand.100"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </Box>
                <Heading size="md" color="white">No Analysis Yet</Heading>
                <Text color="gray.400">
                  Enter a search term and click "Analyze Tweets" to see the sentiment analysis results here.
                </Text>
              </VStack>
            )}

          </MotionBox>
        </Box>
      </Box>
    </ChakraBaseProvider>
  );
}
