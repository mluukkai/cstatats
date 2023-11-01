from counter import Counter


class CounterLibrary:
    def __init__(self):
        self._counter = Counter()

    def increase_counter(self):
        self._counter.increase()

    def reset_counter(self):
        self._counter.reset()

    def increment_counter_by(self, amount):
        int_amount = int(amount)
        self._counter.increment(int_amount)

    def counter_value_should_be(self, expected):
        int_expected = int(expected)
        if self._counter.value != int_expected:
            raise AssertionError(f"{self._counter.value} != {int_expected}")
