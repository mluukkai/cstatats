class And:
    def __init__(self, *matchers):
        self._matchers = matchers

    def test(self, player):
        for matcher in self._matchers:
            if not matcher.test(player):
                return False

        return True


class Or:
    def __init__(self, *matchers):
        self._matchers = matchers

    def test(self, player):
        for matcher in self._matchers:
            if matcher.test(player):
                return True

        return False


class All:
    def test(self, _):
        return True


class Not:
    def __init__(self, matcher):
        self._matcher = matcher

    def test(self, player):
        return not self._matcher.test(player)


class PlaysIn:
    def __init__(self, team):
        self._team = team

    def test(self, player):
        return player.team == self._team


class HasAtLeast:
    def __init__(self, value, attr):
        self._value = value
        self._attr = attr

    def test(self, player):
        player_value = getattr(player, self._attr)

        return player_value >= self._value


class HasFewerThan:
    def __init__(self, value, attr):
        self._matcher = Not(HasAtLeast(value, attr))

    def test(self, player):
        return self._matcher.test(player)


class QueryBuilder:
    def __init__(self):
        self._matcher = All()

    def build(self):
        matcher = self._matcher
        self._matcher = All()
        return matcher

    def playsIn(self, team):
        self._matcher = And(PlaysIn(team), self._matcher)
        return self

    def hasAtLeast(self, value, attr):
        self._matcher = And(HasAtLeast(value, attr), self._matcher)
        return self

    def hasFewerThan(self, value, attr):
        self._matcher = And(HasFewerThan(value, attr), self._matcher)
        return self

    def oneOf(self, m1, m2):
        self._matcher = Or(m1, m2)

        return self
