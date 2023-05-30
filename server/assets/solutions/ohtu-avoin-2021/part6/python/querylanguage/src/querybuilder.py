from matchers import All, And, PlaysIn, HasAtLeast, Not, Or

class Querybuilder:
    def __init__(self, matcher = All()):
        self._matcher = matcher

    def build(self):
        return self._matcher

    def playsIn(self, team):
        return Querybuilder(And(self._matcher, PlaysIn(team)))

    def hasAtLeast(self,  value, attr):
        return Querybuilder(And(self._matcher, HasAtLeast(value, attr)))

    def hasFewerThan(self,  value, attr):
        return Querybuilder(And(self._matcher, Not(HasAtLeast(value, attr))))

    def oneOf(self, m1, m2):
        return Querybuilder(Or(m1, m2))