package com.ionatech.nac.ygb.domain.valueobjects;

public record LeaderboardSort(Key key, Direction direction) {

    public enum Key {
        TOTAL_COUNT,
        FULL_NAME
    }

    public enum Direction {
        ASC,
        DESC
    }

    public LeaderboardSort {
        if (key == null) {
            throw new IllegalArgumentException("LeaderboardSort key must not be null.");
        }
        if (direction == null) {
            throw new IllegalArgumentException("LeaderboardSort direction must not be null.");
        }
    }

    public static LeaderboardSort defaultSort() {
        return new LeaderboardSort(Key.TOTAL_COUNT, Direction.DESC);
    }

    public static LeaderboardSort of(String key, String direction) {
        Key resolvedKey = parseKey(key);
        Direction resolvedDirection = parseDirection(direction, resolvedKey);
        return new LeaderboardSort(resolvedKey, resolvedDirection);
    }

    private static Key parseKey(String key) {
        if (key == null || key.isBlank()) {
            return Key.TOTAL_COUNT;
        }
        return switch (key.trim()) {
            case "totalCount", "TOTAL_COUNT" -> Key.TOTAL_COUNT;
            case "fullName", "FULL_NAME" -> Key.FULL_NAME;
            default -> throw new IllegalArgumentException("Unsupported leaderboard sort key: " + key);
        };
    }

    private static Direction parseDirection(String direction, Key key) {
        if (direction == null || direction.isBlank()) {
            return key == Key.FULL_NAME ? Direction.ASC : Direction.DESC;
        }
        return switch (direction.trim().toLowerCase()) {
            case "asc" -> Direction.ASC;
            case "desc" -> Direction.DESC;
            default -> throw new IllegalArgumentException("Unsupported leaderboard sort direction: " + direction);
        };
    }
}
