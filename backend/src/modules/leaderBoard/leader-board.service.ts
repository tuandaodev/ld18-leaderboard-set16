import axios from "axios";
import { parse } from 'csv-parse';
import fs from "fs";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { AccountDto, CsvTeamDto } from "./leader-board.dto";
import { ChampionMasteriesDetail, RiotMatchDto } from "./leader-board.riot-dto";

export const getRiotAccountByIdURL = (gameName: string, gameTag: string): string => {
  const apiKey = process.env.RIOT_TOKEN;
  return `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${gameTag}?api_key=${apiKey}`;
};

export const getRiotAccountById = async (gameName: string, gameTag: string): Promise<any> => {
  if (gameName == null || gameTag == null) {
    return null;
  }
  const url = getRiotAccountByIdURL(gameName, gameTag);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error(`Error calling API for ${gameName} ${gameTag}:`, error.message);
    return null;
  }
};

export const groupBy = (input: any, key: any) => {
  return input.reduce((acc: any, currentValue: any) => {
    let groupKey = currentValue[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(currentValue);
    return acc;
  }, {});
};

export const getMatchesURL = (puuid: string, start: number, count: number, startDate: string, endDate: string): string => {
  const apiKey = process.env.RIOT_TOKEN; // Thay YOUR_API_KEY bằng API Key của bạn
  // const startTime = process.env.RIOT_START_TIMESTAMP;
  // const endTime = process.env.RIOT_END_TIMESTAMP;
  // const startDate: any = process.env.RIOT_START_DATE;
  const localStartDate = `${startDate}T00:00:00+07:00`;
  const localEndDate = `${endDate}T23:59:59+07:00`;
  const startTime = new Date(localStartDate).getTime() / 1000;
  const endTime = new Date(localEndDate).getTime() / 1000;

  return `https://sea.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${apiKey}&startTime=${startTime}&endTime=${endTime}`;
}

export const getMatches = async (puuid: string, start: number, count: number, startDate: string, endDate: string): Promise<string[]> => {
  const url = getMatchesURL(puuid, start, count, startDate, endDate);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error(`Error calling API to get matches for ${puuid} - start: ${start}:`, error.message);
    return [];
  }
};

export const getMatchDetailURL = (matchId: string): string => {
  const apiKey = process.env.RIOT_TOKEN; // Thay YOUR_API_KEY bằng API Key của bạn
  return `https://sea.api.riotgames.com/tft/match/v1/matches/${matchId}?api_key=${apiKey}`;
}

export const getMatchDetail = async (matchId: string): Promise<RiotMatchDto> => {
  const url = getMatchDetailURL(matchId);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error(`Error calling API to get match detail: ${matchId}`, error.message);
    return null as any;
  }
};

/**
 * Parse rate limit header (e.g., "500:10,30000:600" means 500 requests per 10 seconds, 30000 requests per 600 seconds)
 */
const parseRateLimit = (headerValue: string | undefined): Array<{ limit: number; window: number }> => {
  if (!headerValue) return [];
  
  return headerValue.split(',').map(part => {
    const [limit, window] = part.trim().split(':').map(Number);
    return { limit, window };
  });
};

/**
 * Parse rate limit count header (e.g., "1:10,1:600" means current count for each window)
 */
const parseRateLimitCount = (headerValue: string | undefined): Array<{ count: number; window: number }> => {
  if (!headerValue) return [];
  
  return headerValue.split(',').map(part => {
    const [count, window] = part.trim().split(':').map(Number);
    return { count, window };
  });
};

/**
 * Rate limiter instances for Riot API
 * These are dynamically updated based on response headers
 */
interface RateLimiterConfig {
  limiter: RateLimiterMemory;
  limit: number;
  window: number;
}

let appRateLimiters: Map<number, RateLimiterConfig> = new Map();
let methodRateLimiter: RateLimiterConfig | null = null;

/**
 * Update rate limiters based on response headers
 */
const updateRateLimitersFromHeaders = (headers: any): void => {
  const appRateLimit = parseRateLimit(headers['x-app-rate-limit']);
  const methodRateLimit = parseRateLimit(headers['x-method-rate-limit']);
  
  // Update app rate limiters
  for (const limit of appRateLimit) {
    const existing = appRateLimiters.get(limit.window);
    if (!existing || existing.limit !== limit.limit) {
      appRateLimiters.set(limit.window, {
        limiter: new RateLimiterMemory({
          points: limit.limit,
          duration: limit.window,
        }),
        limit: limit.limit,
        window: limit.window,
      });
    }
  }
  
  // Update method rate limiter (use the most restrictive one)
  if (methodRateLimit.length > 0) {
    // Find the most restrictive limit (lowest requests per second)
    const mostRestrictive = methodRateLimit.reduce((prev, current) => {
      const prevRate = prev.limit / prev.window;
      const currentRate = current.limit / current.window;
      return currentRate < prevRate ? current : prev;
    });
    
    if (!methodRateLimiter || 
        methodRateLimiter.limit !== mostRestrictive.limit ||
        methodRateLimiter.window !== mostRestrictive.window) {
      methodRateLimiter = {
        limiter: new RateLimiterMemory({
          points: mostRestrictive.limit,
          duration: mostRestrictive.window,
        }),
        limit: mostRestrictive.limit,
        window: mostRestrictive.window,
      };
    }
  }
};

/**
 * Consume rate limit points and wait if necessary
 */
const consumeRateLimit = async (key: string = 'riot-api'): Promise<void> => {
  // Try to consume from method rate limiter first (most restrictive)
  if (methodRateLimiter) {
    try {
      await methodRateLimiter.limiter.consume(key);
    } catch (rejRes: any) {
      // Rate limit exceeded, wait for the reset time
      const msBeforeNext = rejRes.msBeforeNext || 1000;
      await new Promise(resolve => setTimeout(resolve, msBeforeNext));
      // Retry after waiting
      await methodRateLimiter.limiter.consume(key);
    }
  }
  
  // Also consume from all app rate limiters
  for (const config of appRateLimiters.values()) {
    try {
      await config.limiter.consume(key);
    } catch (rejRes: any) {
      const msBeforeNext = rejRes.msBeforeNext || 1000;
      await new Promise(resolve => setTimeout(resolve, msBeforeNext));
      await config.limiter.consume(key);
    }
  }
};

/**
 * Get multiple match details with rate limit handling using rate-limiter-flexible
 * @param matchIds Array of match IDs to fetch
 * @param options Optional configuration
 * @returns Array of match details (null for failed requests)
 */
export const getMatchesDetails = async (
  matchIds: string[],
  options?: {
    maxRetries?: number;
    retryDelay?: number;
  }
): Promise<(RiotMatchDto | null)[]> => {
  const maxRetries = options?.maxRetries ?? 3;
  const retryDelay = options?.retryDelay ?? 1000;
  
  const results: (RiotMatchDto | null)[] = [];
  
  for (let i = 0; i < matchIds.length; i++) {
    const matchId = matchIds[i];
    let retries = 0;
    let success = false;
    
    while (retries <= maxRetries && !success) {
      try {
        // Consume rate limit before making request (if limiters are initialized)
        // On first request, limiters might not be initialized yet
        if (methodRateLimiter || appRateLimiters.size > 0) {
          await consumeRateLimit('riot-api');
        }
        
        const url = getMatchDetailURL(matchId);
        const response = await axios.get(url);
        
        // Update rate limiters based on response headers
        updateRateLimitersFromHeaders(response.headers);
        
        // Store the result
        results.push(response.data);
        success = true;
      } catch (error: any) {
        // Handle 429 Too Many Requests
        if (error.response?.status === 429) {
          // Update rate limiters from error response headers if available
          if (error.response?.headers) {
            updateRateLimitersFromHeaders(error.response.headers);
          }
          
          const retryAfter = error.response?.headers['retry-after'];
          const waitTime = retryAfter 
            ? parseInt(retryAfter) * 1000 
            : retryDelay * Math.pow(2, retries); // Exponential backoff
          
          console.warn(`Rate limited for match ${matchId}. Waiting ${waitTime}ms before retry ${retries + 1}/${maxRetries}`);
          
          if (retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, waitTime));
            retries++;
          } else {
            console.error(`Max retries reached for match ${matchId}`);
            results.push(null);
            success = true; // Exit loop even though it failed
          }
        } else {
          // Other errors - log and move on
          console.error(`Error calling API to get match detail: ${matchId}`, error.message);
          results.push(null);
          success = true; // Exit loop
        }
      }
    }
  }
  
  return results;
};

export const getChampionMasteriesURL = (puuid: string, championId: string): string => {
  const apiKey = process.env.RIOT_TOKEN; // Thay YOUR_API_KEY bằng API Key của bạn
  // const championId = process.env.CHAMPION_ID;
  return `https://vn2.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/by-champion/${championId}?api_key=${apiKey}`;
}

export const getChampionMasteriesDetail = async (puuid: string, championId: string): Promise<ChampionMasteriesDetail> => {
  const url = getChampionMasteriesURL(puuid, championId);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    // console.log('url', url);
    console.error(`Error calling API to get champion masteries: ${puuid}`, error.message);
    return null as any;
  }
};

export const getCSVForTeams = async (filePath: string) => {
  const records = [];
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse(
      { delimiter: ';', columns: true }
    ));
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

export const getCSVForUsers = async (filePath: string) => {
  const records = [];
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse(
    ));
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

export const extractGameNameAndTagLine = (input: string): AccountDto => {
  const [gameName, tagLine] = input.split(/[-#]/);
  return new AccountDto(gameName, tagLine);
}

export const convertToCsvTeamDto = (records: any[]): CsvTeamDto[] => {
  return records.map(record => {
    const teamNumber = record.TeamNumber;
    const teamName = record.TeamName;
    const users = [record.User1, record.User2]
      .filter(user => user?.includes('-') || user?.includes('#')) // Ensure it matches the gameName-TagLine format
      .map(user => extractGameNameAndTagLine(user));

    return new CsvTeamDto(teamNumber, teamName, users);
  });
}


export const convertToAccountDto = (records: any[]): AccountDto[] => {
  return records.map(record => {
    const user = extractGameNameAndTagLine(record[0]);
    return new AccountDto(user.gameName, user.tagLine);
  });
}