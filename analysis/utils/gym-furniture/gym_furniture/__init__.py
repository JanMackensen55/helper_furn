from gym.envs.registration import register

register(id='Furniture-v0',
    entry_point='gym_furniture.envs:FurnitureEnv',
)
register(id='SmallFurniture-v0',
    entry_point='gym_furniture.envs:SmallFurnitureEnv',
)
register(id='TAFurniture-v0',
    entry_point='gym_furniture.envs:TAFurnitureEnv',
)
