FactoryBot.define do
  factory :user do
    username { "Pekka" }
    password { "Foobar1" }
    password_confirmation { "Foobar1" }
    admin { true }
  end

  factory :brewery do
    name { "anonymous" }
    year { 1900 }
    active { true }
  end

  factory :style do
    name { "anonymous" }
  end

  factory :beer do
    name { "anonymous" }
    style
    brewery # olueeseen liittyvä panimo luodaan brewery-tehtaalla
  end

  factory :rating do
    score { 10 }
    beer # reittaukseen liittyvä olut luodaan beer-tehtaalla
    user # reittaukseen liittyvä user luodaan user-tehtaalla
  end
end