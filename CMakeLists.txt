cmake_minimum_required(VERSION 3.19)
project(sidereal_engine)

set(CMAKE_CXX_STANDARD 14)

add_executable(sidereal_engine
        main.cpp)

link_libraries(libs/librarytest.h)
target_link_libraries(libs/librarytest.h)
