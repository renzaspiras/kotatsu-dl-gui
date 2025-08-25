package org.koitharu.kotatsu_dl.ui

import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import java.awt.Dimension
import java.awt.Toolkit

enum class WindowSize {
    Compact,    // < 600dp
    Medium,     // 600dp - 840dp
    Expanded    // > 840dp
}

data class ResponsiveInfo(
    val windowSize: WindowSize,
    val isLandscape: Boolean,
    val screenWidth: Dp,
    val screenHeight: Dp
)

@Composable
fun rememberResponsiveInfo(): ResponsiveInfo {
    val density = LocalDensity.current
    var windowSize by remember { mutableStateOf(WindowSize.Expanded) }
    var screenWidth by remember { mutableStateOf(1200.dp) }
    var screenHeight by remember { mutableStateOf(800.dp) }
    
    // Update based on actual screen/window size
    LaunchedEffect(density) {
        val screenDimension = Toolkit.getDefaultToolkit().screenSize
        val screenWidthDp = with(density) { screenDimension.width.toDp() }
        val screenHeightDp = with(density) { screenDimension.height.toDp() }
        
        screenWidth = screenWidthDp
        screenHeight = screenHeightDp
        
        windowSize = when {
            screenWidthDp < 600.dp -> WindowSize.Compact
            screenWidthDp < 840.dp -> WindowSize.Medium
            else -> WindowSize.Expanded
        }
    }
    
    return remember(windowSize, screenWidth, screenHeight) {
        ResponsiveInfo(
            windowSize = windowSize,
            isLandscape = screenWidth > screenHeight,
            screenWidth = screenWidth,
            screenHeight = screenHeight
        )
    }
}

@Composable
fun adaptiveGridColumns(responsiveInfo: ResponsiveInfo): Int {
    return when (responsiveInfo.windowSize) {
        WindowSize.Compact -> 2
        WindowSize.Medium -> 4
        WindowSize.Expanded -> 6
    }
}

@Composable
fun adaptiveSidebarWidth(responsiveInfo: ResponsiveInfo): Dp {
    return when (responsiveInfo.windowSize) {
        WindowSize.Compact -> 240.dp  // When shown as overlay
        WindowSize.Medium -> 240.dp
        WindowSize.Expanded -> 280.dp
    }
}

@Composable
fun shouldShowSidebar(responsiveInfo: ResponsiveInfo): Boolean {
    return responsiveInfo.windowSize != WindowSize.Compact
}

@Composable
fun adaptiveContentPadding(responsiveInfo: ResponsiveInfo): Dp {
    return when (responsiveInfo.windowSize) {
        WindowSize.Compact -> 8.dp
        WindowSize.Medium -> 12.dp
        WindowSize.Expanded -> 16.dp
    }
}