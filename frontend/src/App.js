import React, { useState } from 'react';
import axios from 'axios';
import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  Avatar,
  AvatarGroup,
  Card,
  VStack,
  HStack,
  Alert,
  AlertDescription,
  extendTheme,
} from '@chakra-ui/react';
import { theme as chakraTheme } from '@chakra-ui/theme';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

// Extend the Chakra theme
const theme = extendTheme(chakraTheme);

const COLORS = ['#ff8059', '#ffb86b', '#ff6f3c'];
const sentimentVariants = {
  positive: { bg: 'rgba(255,184,107,0.13)', color: '#ffb86b' },
  negative: { bg: 'rgba(255,128,89,0.13)', color: '#ff8059' },
  neutral: { bg: 'rgba(255,111,60,0.13)', color: '#ff6f3c' },
};

const MotionBox = motion(Box);

function LoadingSpinner() {
  return (
    <motion.div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 24,
        width: 24,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    >
      <svg width="24" height="24" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="#ff8059"
          strokeWidth="5"
          fill="none"
          strokeDasharray="80"
          strokeDashoffset="60"
        />
      </svg>
    </motion.div>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(10);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTweets([]);
    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze/', {
        query,
        count: Number(count),
      });
      setTweets(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error fetching tweets';
      setError(errorMsg);
    }
    setLoading(false);
  };

  const sentimentData = [
    { name: 'Positive', value: tweets.filter((t) => t.sentiment === 'positive').length },
    { name: 'Negative', value: tweets.filter((t) => t.sentiment === 'negative').length },
    { name: 'Neutral', value: tweets.filter((t) => t.sentiment === 'neutral').length },
  ];

  return (
    <ChakraProvider theme={theme}>
      <Flex
        minH="100vh"
        style={{ background: 'linear-gradient(120deg, #191724 0%, #232026 100%)' }}
        fontFamily="Inter, sans-serif"
      >
        <Flex
          flex={1.2}
          direction="column"
          justify="center"
          align="flex-start"
          pl={{ base: 4, md: 20 }}
          pr={{ base: 4, md: 8 }}
        >
          <Heading
            as="h1"
            size="2xl"
            mb={4}
            color="#f8f8f2"
            fontWeight={900}
            lineHeight={1.1}
            letterSpacing="-2px"
          >
            <Box
              as="span"
              style={{
                background: 'linear-gradient(90deg, #ff8059 0%, #ffb86b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Twitter
            </Box>
            <br />
            Sentiment Analyzer
          </Heading>
          <Text fontSize="xl" color="#bfc0c0" mb={8} maxW="420px">
            Analyze public opinion on any topic, event, or brand in real time. Visualize Twitter sentiment with beautiful charts and insights.
          </Text>
          <AvatarGroup size="md" max={5} mb={2}>
            <Avatar name="Ada Lovelace" src="https://randomuser.me/api/portraits/women/44.jpg" />
            <Avatar name="Alan Turing" src="https://randomuser.me/api/portraits/men/46.jpg" />
            <Avatar name="Grace Hopper" src="https://randomuser.me/api/portraits/women/47.jpg" />
            <Avatar name="Linus Torvalds" src="https://randomuser.me/api/portraits/men/48.jpg" />
            <Avatar name="You" src="https://api.dicebear.com/7.x/bottts/svg?seed=sentix" />
          </AvatarGroup>
          <Text color="#bfc0c0" fontSize="sm">
            Join 1500+ developers using SentiX
          </Text>
        </Flex>

        <Flex flex={1} align="center" justify="center" minH="100vh">
          <MotionBox
            width={{ base: '98vw', md: '420px' }}
            style={{
              background: 'rgba(36, 37, 54, 0.95)',
              border: '1.5px solid rgba(255,128,89,0.13)',
            }}
            borderRadius="2xl"
            boxShadow="0 8px 32px rgba(255,128,89,0.10), 0 1.5px 8px rgba(255,184,107,0.08)"
            p={{ base: 4, md: 8 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <Card>
              <Heading
                as="h2"
                size="lg"
                mb={6}
                color="#f8f8f2"
                fontWeight={900}
                letterSpacing="-1px"
                textAlign="center"
              >
                <Box
                  as="span"
                  style={{
                    background: 'linear-gradient(90deg, #ff8059 0%, #ffb86b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Twitter
                </Box>{' '}
                Sentiment
              </Heading>

              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <Input
                    placeholder="Search topic, hashtag, or brand..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    size="lg"
                    bg="#232026"
                    color="#f8f8f2"
                    borderColor="#1a1a22"
                    _placeholder={{ color: '#bfc0c0' }}
                    _focus={{ borderColor: '#ff8059' }}
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
                    bg="#232026"
                    color="#f8f8f2"
                    borderColor="#1a1a22"
                    _placeholder={{ color: '#bfc0c0' }}
                    _focus={{ borderColor: '#ff8059' }}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    style={{
                      background: 'linear-gradient(90deg, #ff8059 0%, #ffb86b 100%)',
                    }}
                    color="white"
                    fontWeight={700}
                    _hover={{ boxShadow: '0 4px 16px rgba(255,128,89,0.13)' }}
                    _active={{ transform: 'scale(0.97)' }}
                    isLoading={loading}
                    loadingText="Analyzing..."
                  >
                    {loading ? <LoadingSpinner /> : 'Analyze'}
                  </Button>
                </VStack>
              </form>

              {error && (
                <Alert status="error" mt={5} bg="rgba(255,128,89,0.08)" borderColor="#ff8059">
                  <AlertDescription color="#ff8059" fontWeight={700}>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {tweets.length > 0 && !loading && (
                <Box mt={8}>
                  <Heading
                    as="h3"
                    size="md"
                    color="#f8f8f2"
                    mb={3}
                    fontWeight={800}
                    letterSpacing="-0.5px"
                  >
                    Sentiment Distribution
                  </Heading>
                  <Box bg="#232026" borderRadius="lg" p={3} mb={5}>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          label
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>

                  <Heading
                    as="h3"
                    size="md"
                    color="#f8f8f2"
                    mb={3}
                    fontWeight={800}
                    letterSpacing="-0.5px"
                  >
                    Tweets
                  </Heading>

                  <VStack align="stretch" spacing={3} maxH="260px" overflowY="auto">
                    {tweets.map((tweet, idx) => (
                      <HStack
                        key={idx}
                        bg={sentimentVariants[tweet.sentiment].bg}
                        borderRadius="md"
                        p={3}
                        boxShadow="0 1px 4px rgba(255,128,89,0.07)"
                        borderLeft={`4px solid ${sentimentVariants[tweet.sentiment].color}`}
                        align="flex-start"
                      >
                        <Text
                          fontWeight={800}
                          color={sentimentVariants[tweet.sentiment].color}
                          fontSize="sm"
                          minW="70px"
                          textTransform="uppercase"
                          letterSpacing="0.5px"
                        >
                          {tweet.sentiment}
                        </Text>
                        <Text color="#f8f8f2" fontWeight={500} fontSize="md">
                          {tweet.text}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}
            </Card>
          </MotionBox>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}
