with w_games as (
    select
        name,
        timestamp,
        goals_red as goals_player,
        goals_blue as goals_opponent,
        -points_red2blue as points,
        'red' as team
    from games
    right join users on users.id = games.id_red
union all
    select
        name,
        timestamp,
        goals_blue as goals_player,
        goals_red  as goals_opponent,
        points_red2blue as points,
        'blue' as team
    from games
    join users on users.id = games.id_blue
)
    select rank() over(ORDER BY coalesce(sum(points), 0) desc) as rank,
           name,
           coalesce(sum(points), 0)+100 as score,
           count(timestamp) as played,
           count((case when goals_player>goals_opponent then true end)) as won,
           count((case when goals_player<goals_opponent then true end)) as lost
    from w_games
    group by name
    order by coalesce(sum(points), 0) desc
;
