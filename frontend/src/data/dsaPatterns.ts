import { DSAPattern } from '../types';

export const DSA_PATTERNS: DSAPattern[] = [
 {
 id: 'sliding-window',
 name: 'Dynamic Sliding Window',
 difficulty: 'Medium',
 frequency: 'Crucial',
 takeaway: 'Expand right pointer to satisfy condition, contract left pointer to optimize window size. Avoid recalculating subarray metrics from scratch.',
 timeComplexity: 'O(N)',
 spaceComplexity: 'O(1) or O(K)',
 exampleProblem: 'Longest Substring Without Repeating Characters (LC 3)',
 link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
 codeSnippet: `def lengthOfLongestSubstring(s: str) -> int:
 char_map = {}
 left = max_len = 0
 for right, ch in enumerate(s):
 if ch in char_map and char_map[ch] >= left:
 left = char_map[ch] + 1
 char_map[ch] = right
 max_len = max(max_len, right - left + 1)
 return max_len`
 },
 {
 id: 'two-pointers',
 name: 'Two Pointers (Converging / Opposite Ends)',
 difficulty: 'Core',
 frequency: 'Very High',
 takeaway: 'Sort array first if index preservation is not needed. Move left or right inward based on target sum comparison to cut search space in half.',
 timeComplexity: 'O(N log N) / O(N)',
 spaceComplexity: 'O(1)',
 exampleProblem: '3Sum (LC 15)',
 link: 'https://leetcode.com/problems/3sum/',
 codeSnippet: `def threeSum(nums: list[int]) -> list[list[int]]:
 nums.sort()
 res = []
 for i in range(len(nums) - 2):
 if i > 0 and nums[i] == nums[i - 1]: continue
 l, r = i + 1, len(nums) - 1
 while l < r:
 s = nums[i] + nums[l] + nums[r]
 if s < 0: l += 1
 elif s > 0: r -= 1
 else:
 res.append([nums[i], nums[l], nums[r]])
 while l < r and nums[l] == nums[l + 1]: l += 1
 while l < r and nums[r] == nums[r - 1]: r -= 1
 l += 1; r -= 1
 return res`
 },
 {
 id: 'top-k-heap',
 name: 'Top K Elements with Min-Heap',
 difficulty: 'Medium',
 frequency: 'Crucial',
 takeaway: 'Maintain a min-heap of size K. If heap exceeds K, pop the smallest element. Guarantees O(N log K) time instead of O(N log N) full sort.',
 timeComplexity: 'O(N log K)',
 spaceComplexity: 'O(K)',
 exampleProblem: 'Top K Frequent Elements (LC 347)',
 link: 'https://leetcode.com/problems/top-k-frequent-elements/',
 codeSnippet: `import heapq
from collections import Counter

def topKFrequent(nums: list[int], k: int) -> list[int]:
 count = Counter(nums)
 return heapq.nlargest(k, count.keys(), key=count.get)`
 },
 {
 id: 'fast-slow',
 name: 'Fast & Slow Pointers (Floyd\'s Cycle)',
 difficulty: 'Core',
 frequency: 'High',
 takeaway: 'Move fast pointer at 2x speed and slow pointer at 1x speed. When they meet, a cycle exists. Useful for linked lists and middle node detection.',
 timeComplexity: 'O(N)',
 spaceComplexity: 'O(1)',
 exampleProblem: 'Linked List Cycle II (LC 142)',
 link: 'https://leetcode.com/problems/linked-list-cycle-ii/',
 codeSnippet: `def detectCycle(head):
 slow = fast = head
 while fast and fast.next:
 slow = slow.next
 fast = fast.next.next
 if slow == fast:
 entry = head
 while entry != slow:
 entry = entry.next
 slow = slow.next
 return entry
 return None`
 },
 {
 id: 'monotonic-stack',
 name: 'Monotonic Stack (Next Greater Element)',
 difficulty: 'Advanced',
 frequency: 'High',
 takeaway: 'Maintain elements in strictly increasing or decreasing order. Pop when incoming element breaks monotonicity to resolve previous range bounds.',
 timeComplexity: 'O(N)',
 spaceComplexity: 'O(N)',
 exampleProblem: 'Daily Temperatures (LC 739)',
 link: 'https://leetcode.com/problems/daily-temperatures/',
 codeSnippet: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
 res = [0] * len(temperatures)
 stack = [] # (index, temp)
 for i, t in enumerate(temperatures):
 while stack and t > stack[-1][1]:
 prev_i, _ = stack.pop()
 res[prev_i] = i - prev_i
 stack.append((i, t))
 return res`
 }
];
