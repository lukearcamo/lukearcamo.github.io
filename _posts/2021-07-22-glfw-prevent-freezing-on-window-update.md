---
title: "GLFW: Prevent freezing on window update"
category: coding
tags: 3D-graphics opengl cpp
needs-rouge: true
---
On some platforms, dragging or resizing a GLFW window causes rendering to freeze until the operation is complete. There are many proposed solutions, but I personally did not have much luck with them. Here is my solution involving multithreading.

<!--split-->

- [1. Problem](#1-problem)
- [2. Solution](#2-solution)
  - [2.1. Basic thread usage](#21-basic-thread-usage)
  - [2.2. Putting OpenGL contexts onto other threads](#22-putting-opengl-contexts-onto-other-threads)
  - [2.3. Event Handling](#23-event-handling)
  - [2.4. Final modified code](#24-final-modified-code)
- [3. Resources](#3-resources)

<!--split-->

## 1. Problem
I'll assume that your regular GLFW code is more or less structured in the standard way, like so:

{% highlight cpp %}
void initialize() {
    // Initialize GLFW, OpenGL, etc.
}
void draw() {
    // OpenGL rendering stuff
}
int main() {
    init();

    while(!glfwWindowShouldClose(window)) {
        draw();
        glfwPollEvents();
    }

    // Clean up OpenGL & GLFW

    return 0;
}
{% endhighlight %}

In the [GLFW documentation](https://www.glfw.org/docs/latest/group__window.html#ga37bd57223967b4211d60ca1a0bf3c832), it says, "On some platforms, a window move, resize or menu operation will cause event processing to block. This is due to how event processing is designed on those platforms."

The documentation suggests a fix using the window refresh callback, however personally, I haven't had success with this method since the callback kept triggering constantly, and the documentation also mentions that this method does not work for compositing window systems.

Another easy fix is to just ignore the freezing, or make the window fullscreen so there is no window resizing/moving. Hmmm. Ok if you want to lol

If this cannot be done, many forum posts I have encountered suggest multithreading, but personally, I have found little information and few examples on how to do this. So, after my own experimentation and research, I devised my own way.

Notice that the hanging occurs at `glfwPollEvents()`. And since rendering occurs within in the same loop, that freezes as well. To fix this, we can run these two things on separate threads.

## 2. Solution

### 2.1. Basic thread usage

From C++11 onward, threading is supported using the `<thread>` header. Creating a thread is simple: `std::thread myThread(function_to_run_on_thread);`.

To finish the thread after the function returns, use `myThread.join()`; on the main thread, which will pause the main thread until the other thread has finished and returned. This function should be called near the end of the `main()` function, so that the other thread finishes smoothly without any errors or warnings.

### 2.2. Putting OpenGL contexts onto other threads

According to the GLFW documentation, the event processing functions `glfwPollEvents` and `glfwWaitEvents` must only be called from the main thread. Fortunately, OpenGL can be run on a separate thread from the main one.

To do this, there is another important piece of information from the [GLFW documentation](https://www.glfw.org/docs/latest/group__context.html#ga1c04dc242268f827290fe40aa1c91157): "When moving a context between threads, you must make it non-current on the old thread before making it current on the new one." This means that in the main thread, after loading OpenGL in your initialize function while the context is current, glfwMakeContextCurrent(NULL) must be called afterwards to make the context non-current, and then glfwMakeContextCurrent must be called again within the other thread to make the context current there.

### 2.3. Event Handling

Additionally, since events are handled on a separate thread from rendering, unless you plan on doing other stuff in the main loop, you can actually use `glfwWaitEvents` rather than `glfwPollEvents`, because rendering will continue regardless of the main thread being paused. On my device, this even increased performance because events are no longer constantly being polled. However, I have not tested this on other platforms so this may differ for you.

Lastly, GLFW supports callbacks for its events, like `glfwSetFramebufferSizeCallback` and `glfwSetKeyCallback`. However, these callbacks are called on the main thread where events are handled. This means that calling OpenGL commands within these functions will not work, because the OpenGL context is not available within the main thread. The way I overcame this was to make the callbacks set flag variables outside of them, which can then be polled within the render thread's loop.

### 2.4. Final modified code

{% highlight cpp %}

void initialize() {
    // Initialize GLFW, loading library, etc. here
}

// Example event callback
bool hasResized = false;
float width = 960.0, height = 540.0;
void onResize(GLFWwindow* window, int w, int h) {
    width = w;
    height = h;
    hasResized = true;
}

void draw() {
    glfwMakeContextCurrent(insert_your_context_variable_here);
    // Setup OpenGL stuff here

    while(!glfwWindowShouldClose(window)) {
        // Handle events using if-blocks
        if (hasResized) {
            // e.g call glViewport, update projection matrices, etc.
        }
        // Draw OpenGL stuff here
    }
}

int main() {
    init();
    glfwMakeContextCurrent(NULL);
    std::thread renderThread(draw);
    while(!glfwWindowShouldClose(window)) {
        glfwWaitEvents();
    }
    renderThread.join();
    // Clean up OpenGL & GLFW here
    return 0;
}

{% endhighlight %}

## 3. Resources

GLFW window reference — [https://www.glfw.org/docs/latest/group__window.html](https://www.glfw.org/docs/latest/group__window.html)
GLFW context reference — [https://www.glfw.org/docs/latest/group__context.html](https://www.glfw.org/docs/latest/group__context.html)
Multithreading GLFW forum discussion — [https://discourse.glfw.org/t/multithreading-glfw/573](https://discourse.glfw.org/t/multithreading-glfw/573)